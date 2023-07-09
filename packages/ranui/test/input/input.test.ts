import Input from '@/components/input'

describe('input', () => {
  it('init input function', () => {
    const element = new Input()
    expect(element).toBeTruthy()
  })
  it('test input ui',()=>{
    new Input()
    const input = document.createElement('r-input')
    document.body.appendChild(input)
    expect(document.body).toMatchSnapshot();
  })
})
