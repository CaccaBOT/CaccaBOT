const cases = [
  'cacca++',
  'cacca+=1',
  '++cacca',
  'cacca=cacca+1',
  'cacca=cacca+=1',
  'cacca=1+cacca',
  'cacca-=(-1)',
  'int*ptr=&cacca;(*ptr)++',
  'cacca=~((~cacca)-1)'
]

const PoopValidator = {
  validate(text: string | undefined) {
    if (text) {
      return cases.includes(text.toLowerCase().replaceAll(' ', ''))
    }
  }
}

export default PoopValidator
