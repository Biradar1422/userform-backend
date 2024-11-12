const mongoose = require('mongoose');

function dbConnect(){
    try{
            mongoose.connect(process.env.DB_URL)
            .then(()=>{
                console.log('Great connected with DB 😊')
            })
    }catch{
        console.log('Failed to Connect', error)
    }
}
module.exports = {dbConnect}; 

