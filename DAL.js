const sqlite3 = require('sqlite3').verbose();
let Promise = require('promise');
let db;

async function query(fn) {
	return new Promise(async(resolve,reject) => {
		db = new sqlite3.Database('TwitchMockServer.db');
		await fn(resolve,reject)
		db.close();
	});
}

class DAL {
	constructor() {

	}

	async initDb() {		
		return query((resolve,reject) => {
			db.serialize(()=>{
				db.parallelize(() => {
					db.run("CREATE TABLE IF NOT EXISTS Rewards (id INTEGER PRIMARY KEY AUTOINCREMENT)");
					db.run(`CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, userId TEXT, message TEXT)`);					
				});
				db.run(`CREATE UNIQUE INDEX IF NOT EXISTS unique_user_message_idx ON Messages(userId)`);
				resolve();
			})
		})
	}

	/**
	 * @returns {Promise<Date>}
	 */
	async getStreamLastChanged() {		
		return query((resolve,reject) => {
			db.get("SELECT date FROM StreamLastChanged", (err, row) => {
				console.log("ERR",err);
				console.log("ROW",row);
				if(err){
					reject(err);
				}
				else{
					resolve(row);
				}
			})
		})
	}

	/**
	 * @param {Date} date
	 * @returns {Promise<void>}
	 */
	async updateStreamLastChanged(date){		
		return query((resolve,reject) => {
			db.run(`INSERT OR REPLACE INTO StreamLastChanged(date)
					VALUES (?)`,[date], (err) => {
				if(err){
					reject(err);
				}
				else{
					resolve();
				}
			})
		})
	}

	/**
	 * @param {String} userId
	 * @returns {Promise<String>}
	 */
	async getMessage(userId) {		
		return query((resolve,reject) => {
			db.get(`SELECT message 
					FROM Messages 
					WHERE userId = ?`,userId, (err, row) => {
				if(err){
					reject(err);
				}
				else{
					resolve(row);
				}
			})
		})
	}

	/**
	 * @param {String} userId
	 * @param {String} message
	 * @returns {Promise<void>}
	 */
	async updateMessage(userId, message) {
		return query((resolve, reject) => {
			db.serialize(() => {
				console.log("Running select")
				db.get("SELECT * FROM Messages WHERE userId = ?", userId, (err, row) => {
					console.log("Got data: ", row)
				})
				console.log("Running INSERT")
				db.run(`INSERT OR REPLACE INTO Messages(userId,message)
						VALUES (?,?)`, [userId, message], (err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				})
			})
		});
	}
}

module.exports = DAL;