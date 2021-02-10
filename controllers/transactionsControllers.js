const db = require("../models");
const axios = require("axios");
require("dotenv").config();

// update position function that takes an existing position and a new transaction and updates the position if you already own a position with that security
const updatePositionBuy = (existing, transaction) => {
  let new_qty = existing.qty + transaction.qty;
  let new_total_cost =
    parseFloat(existing.total_cost) + parseFloat(transaction.total_trade_cost);
  let new_cost_basis = new_total_cost / new_qty;
  let updatedPosition = existing;
  updatedPosition.qty = new_qty;
  updatedPosition.total_cost = new_total_cost;
  updatedPosition.cost_basis = new_cost_basis;

  return updatedPosition;
};

// update position if sell
const updatePositionSell = (existing, transaction) => {
  let new_qty = existing.qty - transaction.qty;
  let new_total_cost =
    parseFloat(existing.total_cost) - parseFloat(transaction.total_trade_cost);
  let new_cost_basis = new_total_cost / new_qty;
  let updatedPosition = existing;
  if (new_cost_basis < 0) {
    new_cost_basis = 0;
    new_total_cost = 0;
  }
  updatedPosition.qty = new_qty;
  updatedPosition.total_cost = new_total_cost;
  updatedPosition.cost_basis = new_cost_basis;

  return updatedPosition;
};

// add transaction to database after buy,sell, etc.  is successful
const addTransaction = (transaction, positionId, res) => {
  transaction.PositionId = positionId;
  db.Transactions.create(transaction).then(result => {
    if (result) {
      res.json({ message: "Transaction Successful!!" });
    }
  });
};

// get broker id
const getBrokerId = (req, res) => {
  let id = db.Brokers.findAll({
    where: {
      name: req.body.broker
    }
  }).then(result => {
    console.log("result of broker search", result);
    if (result.length < 1) {
      return {
        message:
          "You do not have an account open with this broker. please set up your account with " +
          req.body.broker +
          " before adding your transaction!"
      };
    } else {
      return result[0].dataValues.id;
    }
  });
  return id;
};

//update broker information after a deposit adding to the capital and initial stake
const updateAfterDeposit = (existing, deposit) => {
  let eCapital = existing.capital;
  let eStake = existing.initial_stake;
  existing.capital = deposit + eCapital;
  existing.initial_stake = deposit + eStake;
  return existing;
};

//update broker information afer a withdrawal
const updateAfterWithdraw = (existing, withdraw) => {
  let new_capital = existing.capital - withdraw;
  if (new_capital < 0) {
    return { message: "Insufficient funds" };
  } else {
    return new_capital;
  }
};

// remove capital after buy
const capitalAdjustBuy = (amount, id) => {
  db.Brokers.findAll({ where: { id: id } }).then(result => {
    let existing = result[0].dataValues.capital;
    let new_capital = existing - amount;
    console.log(new_capital);
    db.Brokers.update({ capital: new_capital }, { where: { id: id } }).then(
      result => {
        if (result.length > 0) {
          console.log("capital amount updated after buying stock success");
        } else {
          console.log(
            "something went wrong removing capital from broker after buying stock"
          );
        }
      }
    );
  });
};

//add capital after selling stock
const capitalAdjustSell = (amount, id) => {
  db.Brokers.findAll({ where: { id: id } }).then(result => {
    let existing = result[0].dataValues.capital;
    let new_capital = existing + amount;
    db.Brokers.update({ capital: new_capital }, { where: { id: id } }).then(
      result => {
        if (result.length > 0) {
          console.log("capital amount updated after selling stock success");
        } else {
          console.log(
            "something went wrong when adding capital to broker after a sale attempt"
          );
        }
      }
    );
  });
};

//   module exports
module.exports = {
  // first i should probably check to make sure there is enough capital in the broker i am using, but again this is tracking trades, so assuming the trade has already been made on my broker, i shouldnt need to check, just subtrac the balance from the trade from the capital balance to update on front end

  // add new transaction (BUY, OR SELL of STOCKS)
  addNewTransaction: async (req, res) => {
    //   getting broker ID first
    let brokerId = await getBrokerId(req, res);
    console.log("BROKER ID DID IT WORK?!?!?", brokerId);
    // if there is no brokerId found, that means that a broker account has not been set up yet and the user needs to set one up before he/she can enter in a new transaction
    if (typeof brokerId === "object" && brokerId !== null) {
      return res.json(brokerId);
    }
    //   trans type, either BUY or SELL
    let type = req.body.type;

    // position id to store, whether new or existing
    let positionId;
    //   newTransaction
    let newTransaction = req.body;
    // putting the ticker to all uppercase just in case a user doesnt enter it in uppercase, although i guess i could have done that on the front end
    let ticker = req.body.ticker.toUpperCase();
    newTransaction.ticker = ticker;

    // total trade cost saved to remove from capital in broker
    let trade_cost = req.body.total_trade_cost;

    // prepping data for a new position/updated position to be added to database along with transaction
    let position = {
      ticker: ticker,
      qty: req.body.qty,
      cost_basis: req.body.share_price,
      total_cost: req.body.total_trade_cost,
      broker: req.body.broker,
      trade_time: req.body.trade_time,
      type: req.body.type,
      BrokerId: brokerId
    };
    console.log("TRANSACTION DATA JUST ENTERED-->>**", position);
    let baseURL =
      "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=" +
      ticker +
      "&region=US&interval=1d&range=1y";
    //   getting real time data on ticker to store
    // axios
    //   .get(baseURL, {
    //     headers: {
    //       "x-rapidapi-key": process.env.API_KEY
    //     }
    //   })
    //   .then(result => console.log("RESULT OF API CALL", result.data.price));

    //   creating or updating the position that this transaction affects
    // first check to see if that position exists, no need to check for broker as that check has already happened at this point
    db.Positions.findAll({
      where: {
        ticker: position.ticker,
        BrokerId: brokerId
      }
    }).then(result => {
      //   if it doesn't exist - create a new position with the transaction data, also implies the transaction is a buy, as you cannot sell what you do not have (no position on that ticker means u have no shares)
      if (result.length < 1) {
        db.Positions.create(position).then(newPosition => {
          console.log("new position id added", newPosition.dataValues.id);
          positionId = newPosition.dataValues.id;
          addTransaction(newTransaction, positionId, res);
          capitalAdjustBuy(trade_cost, brokerId);
        });
      } else {
        // otherwise  if there is an existing postion for that ticker, grab existing data, alter it based on whether the trans is a BUY  or SELL with new transaction data and send that updated data to the DB
        let existingPosition = result[0].dataValues;

        //   IF its a buy order
        if (type === "BUY") {
          console.log("already a position with this ticker", existingPosition);
          console.log("NEW TRANSACTION DATA", newTransaction);
          positionId = existingPosition.id;
          let updatedPosition = updatePositionBuy(
            existingPosition,
            newTransaction
          );
          db.Positions.update(updatedPosition, {
            where: {
              id: updatedPosition.id
            }
          }).then(dbUpdatedPosition =>
            console.log(
              "DATABASE UPDATED POSITION  and buy SUCCESSFUL--->",
              dbUpdatedPosition
            )
          );
          addTransaction(newTransaction, positionId, res);
          capitalAdjustBuy(trade_cost, brokerId);
        }
        //   if IT IS A SELL ORDER
        else if (type === "SELL") {
          let updatedPosition = updatePositionSell(
            existingPosition,
            newTransaction
          );
          console.log("UPDATED POSITION AFTER SALE", updatedPosition);
          // if the quantity of users shares gets to 0, then its closing the position, set it to closed.
          if (updatedPosition.qty === 0) {
            let closedPosition = {
              id: updatedPosition.id,
              ticker: updatedPosition.ticker,
              qty: updatedPosition.qty,
              cost_basis: 0,
              total_cost: 0,
              broker: updatedPosition.broker,
              BrokerId: updatedPosition.BrokerId,
              status: "CLOSED"
            };
            db.Positions.update(closedPosition, {
              where: { id: updatedPosition.id }
            }).then(result => {
              console.log(
                "RESULT FROM CLOSING POSIION AFTER A SALLE--<<<",
                result
              );
              addTransaction(newTransaction, updatedPosition.id, res);
              capitalAdjustSell(trade_cost, brokerId);
            });
          }
          // making sure qty canT go below zero , and asks to revise the share qty price
          else if (updatedPosition.qty < 0) {
            res.json({
              message:
                "You do not have that many shares to sell, please edit the share quantity!"
            });
          }
          // otherwise update the position with the new numbers
          else if (updatedPosition.qty > 0) {
            db.Positions.update(updatedPosition, {
              where: {
                id: updatedPosition.id
              }
            }).then(dbUpdatedPosition => {
              if (dbUpdatedPosition[0] === 1) {
                console.log("position updated after sale, but not closed");
              }
              addTransaction(newTransaction, updatedPosition.id, res);
              capitalAdjustSell(trade_cost, brokerId);
            });
          }
        }
      }
    });
  },

  //   get all transactions from database
  getAll: (req, res) => {
    db.Transactions.findAll().then(result => res.json(result));
  },

  //deposit funds into a specific broker and adjust capital and stake
  deposit: (req, res) => {
    let brokerId = req.body.id;
    let amount = req.body.amount;
    console.log("DEPOSIT REQUEST BODY", amount);
    console.log("BROKER ID-->>", brokerId);
    db.Brokers.findAll({
      where: {
        id: brokerId
      }
    }).then(result => {
      let existingBrokerInfo = result[0].dataValues;
      console.log("existing broker DATA--->", existingBrokerInfo);
      let newBrokerInfo = updateAfterDeposit(existingBrokerInfo, amount);
      console.log("NEW BROKER INFO***___>>>>", newBrokerInfo);
      let { capital, initial_stake } = newBrokerInfo;
      console.log(capital, initial_stake);
      db.Brokers.update(
        { capital: capital, initial_stake: initial_stake },
        { where: { id: brokerId } }
      ).then(result => {
        console.log(result);
        if (result.length > 0) {
          res.json({
            message:
              "Deposit of " +
              amount +
              " was successfully added to your account with " +
              existingBrokerInfo.name
          });
        }
      });
    });
  },

  //withdraw funds from a specific broker and adjusting capital amount in database
  withdraw: (req, res) => {
    let brokerId = req.body.id;
    let amount = req.body.amount;
    db.Brokers.findAll({
      where: {
        id: brokerId
      }
    }).then(result => {
      console.log(result);
      let existingBrokerInfo = result[0].dataValues;
      console.log("existing broker DATA--->", existingBrokerInfo);
      let newBrokerInfo = updateAfterWithdraw(existingBrokerInfo, amount);
      console.log("NEW BROKER DATA AFTER WITHDRAWAL**--->", newBrokerInfo);
      //   if they try to remove more than is in their account (on record at least, this depends on user regularly updating the information for it to be accurate)
      if (newBrokerInfo.message === "Insufficient funds") {
        res.json({
          message: "Insufficient funds. Cannot withdraw that amount"
        });
      } else {
        db.Brokers.update(
          { capital: newBrokerInfo },
          {
            where: {
              id: existingBrokerInfo.id
            }
          }
        ).then(withdrawResult => {
          // if user empties their account
          if (withdrawResult.length > 0 && newBrokerInfo === 0) {
            res.json({
              message:
                "You have removed the remaining $" +
                amount +
                " and emptied your account with " +
                existingBrokerInfo.name
            });
            // if the user withdraws some of their cash
          } else if (withdrawResult.length > 0) {
            res.json({
              message:
                "The amount of " +
                amount +
                " was successfully withdrawn from  your account with " +
                existingBrokerInfo.name
            });
          }
        });
      }
    });
  }
};
