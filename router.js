module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send({hi: 'there'})
  })
  app.get('/timestamp*', function (req, res) {
    console.log(req.params)
    res.send('yolo')
  })
}