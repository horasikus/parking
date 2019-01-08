/*
import { join } from 'path';
import moment from 'moment';
import csv from 'csv-parse';
import { createReadStream, readdirSync } from 'fs';
*/
// const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// const formatDate = date => moment(date).format(DATE_FORMAT);
/*
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
// "Medio de pago";"Hora del servidor";"Fecha del terminal";"C�digo parqu�metro";"Importe:";"DUraci�n total";"Duraci�n pagada";"Duraci�n total en minutos";"Duraci�n pagada en minutos";"ID de sistema";"Recibo impreso";"Plaza";"Matr�cula";"Tipo de tarjeta";"N�mero de tarjeta:";"Descripci�n zona";"Descripci�n circuito";"C�digo de Parque";"Parque";"Descripci�n Parqu�metro";"Direcci�n";"Tipo";"Tipo de usuario:";"Fecha final";"Tiempo gratuito:";"Duraci�n gratuita en minutos";"Divisa";"Id del banco"
// "Monedas";"31/12/2017 21:26";"31/12/2017 17:49";"21";"0,50";"41 h ";"40 m ";"2460";"40";"265655879";"84164";"";"";"";"";"SUD EST-ESTACIO";"MENDEZ NU�EZ I VOLTANT";"612";"Figueras";"STELIO 21";"Carrer M�ndez N��ez, 50";"Parking";"1";"02/01/2018 10:49";"40 h 20 m ";"2420";"EUR";""
// bookingStartDate: "31/12/2017 17:49"
// db: 16:49
// works OK looking between 17 - 18
/*
const startDate = new Date(2017, 11, 31); // 31-12-2017,
startDate.setHours(17);
const endDate = new Date(2017, 11, 31); // 01-01-2018
endDate.setHours(18);
app.models.Transaction.find({
  order: 'date',
  where: {
    and: [
      {
        bookingStartDate: {
          between: [formatDate(startDate), formatDate(endDate)],
        },
      },
    ],
  },
}, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Transaction::find', formatDate(startDate), formatDate(endDate), data.length);
  }
});
*/
"use strict";