export function splitStringAndRemoveFirstElement(inputString: string) {
  const splittedArray: string[] = inputString.split(',').map(_ => _.toLowerCase().trim());

  if (splittedArray.length > 1) {
    let firstWorld = splittedArray.shift();
    return {
        product: firstWorld,
        keyWords: splittedArray 
    }
  }

  return false;
}