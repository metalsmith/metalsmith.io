require('./build')(function(err){
  if (err) throw err;
  console.log('Build succeeded!');
});
