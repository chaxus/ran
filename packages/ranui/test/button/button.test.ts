import Button from '@/components/button'

describe('button', () => {
  it('init button function', () => {
    const element = new Button()
    expect(element).toBeTruthy()
  })
  it('test button ui', () => {
    new Button()
    const rButton = document.createElement('r-button')
    document.body.appendChild(rButton)
    expect(document.body).toMatchSnapshot()
  })
})
