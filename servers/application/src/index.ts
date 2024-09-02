import app from './app'

app.listen(process.env.PORT, () => {
  console.log(`Server active on port ${process.env.PORT}...`)

  if (process.send) process.send('ready')
})