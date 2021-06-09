const express = require('express')
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static('public'));
const port = 3000

let rawdata = fs.readFileSync('solutions.json');
let solutions = JSON.parse(rawdata);

let labels = JSON.parse(fs.readFileSync('labels.json'));


app.get('/', (req, res) => {
  
  let avail_imgs = JSON.parse(fs.readFileSync('avail.json'));
  let img_ids = Object.keys(avail_imgs);
  let labels = JSON.parse(fs.readFileSync('labels.json'));
  let expression
  while (typeof expression == 'undefined') {
    var rand_indx = Math.floor((Math.random() * img_ids.length));
    let expressions = labels[img_ids[rand_indx]];
    var len = expressions.length;
    expression = expressions.pop();
  }
  res.json({
    image:`http://localhost:3000/images/${img_ids[rand_indx]}.png`, 
    'expression': expression, 
    'exp_index': (len-1)})
})


app.post('/submit', (req, res) => {
  // get response
  let img_id = req.query['img_id'];
  let exp_index = req.query['exp_index'];
  let response = JSON.parse(req.query['response']);
  console.log(response);
  let data = 'word\tnormalized spelling\tpos sequence\tsemantic category\t# of instances of head\taccuracy\thead of complex modifier\tComplement of complex modifier\n';
  let i = 0;
  let rowName = 'row' + String(i);
  while (typeof response[rowName] != 'undefined') {
    let rowData = response[rowName];
    data += rowData.join('\t') + '\n';
    console.log(data);
    i += 1;
    rowName = 'row' + String(i);
  } 
  let fileName = img_id + '_' + exp_index + '.tsv';
  console.log(data);
  fs.writeFile(fileName, data, function (err){
    if (err) throw err;
    console.log('Saved!');
    let labels = JSON.parse(fs.readFileSync('labels.json'));
    labels[img_id].pop();
    fs.writeFile('labels.json', JSON.stringify(labels), (err) => {
      console.log(err);
    });
    res.json({'message': 'response recorded'});
  })
  // get solution
  // let sol = solutions[img_id];
  // let record_data = '';
  // if (response == String(sol)) {
  //   record_data = `${img_id},true`;
  // } else if (isNaN(response)) {
  //   record_data = `${img_id},${response}`;
  // } else {
  //   record_data = `${img_id},false`;
  // }
  // // record response
  // fs.appendFile('record.txt', record_data+'\n', function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  //   let avail_imgs = JSON.parse(fs.readFileSync('avail.json'));
  //   delete avail_imgs[img_id];
  //   fs.writeFile('avail.json', JSON.stringify(avail_imgs), (err) => {
  //     console.log(err);
  //   });

  // });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
