/*
import { join } from 'path';
import parse from 'csv-parse';
import { createReadStream, readdirSync } from 'fs';

module.exports = function (app) {
  readdirSync('db').forEach(fileName => {
    const file = join('db', fileName);
    createReadStream(file)
      .pipe(parse({ delimiter: ';' }))
      .on('data', csvrow => {
        app.models.Transaction.create({
          id: csvrow[9],
          parkingMeter_id: csvrow[3],
          date: csvrow[1],
          bookingStartDate: csvrow[2],
          bookingEndDate: csvrow[23],
          paidMinutes: csvrow[8],
          freeMinutes: csvrow[25],
          rate: csvrow[15],
          customerType: csvrow[22],
          ticketNumber: csvrow[10],
          price: csvrow[4],
          paymentID: csvrow[9],
          paymentType: csvrow[21],
          paymentMethod: csvrow[0],
          totalMinutes: csvrow[7],
        }, (err, transaction) => {
          if (err) {
            if (err) throw err;
            console.log(transaction);
          }
        });
      })
      .on('end', () => {
      });
  });
};
*/
