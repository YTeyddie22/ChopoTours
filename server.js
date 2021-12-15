const app = require('./app');

const port = 3000;

console.log(app.get('env'));

app.listen(port, () => {
	console.log('app runnings ', port);
});
