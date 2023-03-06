const mongoose=require('mongoose')
const Campground=require('../models/Campground')
const cities=require('./in')
const {places,descriptors}=require('./seedHelpers')
const mongo = require('../mongo.js');

// mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp',{
//     useNewUrlParser:true,
//     //useCreateIndex:true,
//     useUnifiedTopology:true
// })

const db=mongoose.connection
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('database connected')
})

const sample=((array)=>{
    return array[Math.floor(Math.random()*array.length)];
})

const seedDB=async()=>{
    await Campground.deleteMany({})
    for(let i=0; i<250; i++)
    {
        const random1000=Math.floor(Math.random()*406)
        const price=Math.floor(Math.random()*20)+10
        const camp=new Campground({location:`${cities[random1000].city} ${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        image:'https://source.unsplash.com/collection/483251',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        price:price,
        author : '63c52ded86bc9800e20b6f14',
        images : [
            {
              url: 'https://res.cloudinary.com/dopx0nsls/image/upload/v1674022680/YelpCamp/tw4s1aij6rcosfde7imb.jpg',
              filename: 'YelpCamp/tw4s1aij6rcosfde7imb'
            },
            {
              url: 'https://res.cloudinary.com/dopx0nsls/image/upload/v1674022679/YelpCamp/bozntffk5ycuawqes8dm.jpg',
              filename: 'YelpCamp/bozntffk5ycuawqes8dm'
            }
          ],
          geometry : { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] }
        })
       
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
});

mongo();