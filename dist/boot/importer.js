/*
import { join } from 'path';
import moment from 'moment';
import csv from 'csv-parse';
import { createReadStream, readdirSync } from 'fs';

module.exports = function (app) {
  readdirSync('db').forEach(fileName => {
    const file = join('db', fileName);
    const results = [];
    createReadStream(file)
      .pipe(csv({ delimiter: ';', skip_empty_lines: true, skip_lines_with_empty_values: true }))
      .on('data', csvrow => {
        results.push({
          id: csvrow[9] || 0,
          parkingMeter_id: csvrow[3] || 0,
          date: moment(csvrow[1], 'DD/MM/YYYY HH:mm').toDate(),
          bookingStartDate: moment(csvrow[2], 'DD/MM/YYYY HH:mm').toDate(),
          bookingEndDate: moment(csvrow[23], 'DD/MM/YYYY HH:mm').toDate(),
          paidMinutes: csvrow[8] || 0,
          freeMinutes: csvrow[25] || 0,
          rate: 'other',
          customerType: csvrow[22] || '',
          ticketNumber: csvrow[10] || 0,
          price: csvrow[4].replace(',', '.') || 0,
          paymentID: csvrow[9] || 0,
          paymentType: 'parkingMeter',
          paymentMethod: csvrow[0] || 'other',
          totalMinutes: csvrow[7] || 0,
        });
      })
      .on('end', () => {
        app.models.Transaction.create(results, (err, instance, created) => {
          if (err) console.log(instance);
        });
        console.log('finished: ', file);
      });
  });
};
*/
"use strict";