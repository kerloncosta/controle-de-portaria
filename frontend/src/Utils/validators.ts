export function validateCpfFormat(cpf: string): boolean{

  const cleanCpf = cpf.replace(/\D/g, '');

  if (cleanCpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1+$/.test(cleanCpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
}

export function validatePassword(password: string): boolean{

  if(password.length < 6){
    return false;

  }else if(!/\d/.test(password)){
    return false;

  }else if(!/[A-Z]/.test(password)){
    return false;

  }
  return true;
}

export function validateCnhFormat(cnh: string): boolean {

  const cleanCnh = cnh.replace(/\D/g, '');

  if (cleanCnh.length !== 11 || /^(\d)\1{10}$/.test(cleanCnh)) {
    return false;
  }

  let dsc = 0;
  let v = 0;

  for (let i = 0, j = 9; i < 9; i++, j--) {
    v += parseInt(cleanCnh.charAt(i)) * j;
  }

  let d1 = v % 11;
  if (d1 >= 10){
    d1 = 0;
    dsc = 2;
  }

  v = 0;
  for (let i = 0, j = 1; i < 9; i++, j++) {
    v += parseInt(cleanCnh.charAt(i)) * j;
  }
  
  let x = v % 11;
  let d2 = x >= dsc ? x - dsc : 11 + x - dsc;

  if(d2 >= 10){
    d2 = 0;
  }

  return d1 === parseInt(cleanCnh.charAt(9)) && d2 === parseInt(cleanCnh.charAt(10));
}

export function validatePlateFormat(plate: string): boolean {
  const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (cleanPlate.length !== 7) {
    return false;
  }

  const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

  return plateRegex.test(plate);
}
