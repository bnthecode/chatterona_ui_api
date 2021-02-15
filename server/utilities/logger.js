
export default {
  error: (info) => console.log('\x1b[31m%s\x1b[0m', info),
  info: (info) =>  console.log('\x1b[33m%s\x1b[0m', info),
  success: (info) =>  console.log('\x1b[35m%s\x1b[0m', info),
};
