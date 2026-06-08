function isUndef(v) {
  return v === undefined || v === null;
}

function isTrue(v){
    return v === true || v === 'true';
}
function isFalse(v){
    return v === false || v === 'false';
}

function isPrimitive(v) {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'symbol'
  );
}


function isFunction(v) {
  return typeof v === 'function';
}

function isObject(v) {
  return typeof v === 'object' && v !== null;
}

export default {
    isUndef,
    isTrue,
    isPrimitive,
    isFalse,

};