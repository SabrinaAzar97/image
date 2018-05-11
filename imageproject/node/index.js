// const pyshell = require('python-shell')
// 	// ,	pyshell = new PythonShell('')

// pyshell.run('Final.py', err => {
//   if (err) throw err
//   console.log('finished')
// })
// const sys = require('util')
const exec = require('child_process').exec;

exec("python ./Final.py 1 test.png hi test1.png", (error, stdout, stderr) => {
  console.log(error)
  console.log(stdout)
  console.log(stderr)
})
utils.download_image('https://scontent.fbey5-1.fna.fbcdn.net/v/t1.15752-0/s261x260/32187692_10156522566999742_1473588186742521856_n.png?_nc_cat=0&oh=b70fe77e6752b19c91868f217dc4f470&oe=5B96A074', 'test2.png', data => {
  exec('python ./Final.py 2 test2.png test3.png', (error, stdout, stderr) => {
    console.log(error)
    console.log(stdout)
    console.log(stderr)
    // socket.emit("newMessage")
  })
})