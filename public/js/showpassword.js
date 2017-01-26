function togglePasswordMask(event) {
  let txtpw     = document.querySelector('#password');
  let cbUnmask  = document.querySelector('#checkbox-unmask-pw');

  txtpw.type = cbUnmask.checked ?  'text' : 'password';
}
