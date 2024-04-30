// const { Server} = require('socket.io')

// function serverSocket(server){
//     console.log('socket setup complete');
//     const io = new Server(server,{
//         cors:{
//           origin:"http://localhost:3000",
//           methods:['GET',"POST"]
//         }
//       })

//     io.on('connection',(socket)=>{
//         socket.on('posted',()=>{
//             console.log('new post')
//             io.emit('newpost');
//         })
//     })
// }

// module.exports = serverSocket