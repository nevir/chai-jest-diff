import chai, { expect } from 'chai'
import chaiJestDiff from './index'

chai.use(chaiJestDiff())

describe('Jest-style diffing', () => {
  it('should work for positive shallow equality', () => {
    expect(() => {
      expect(42).to.equal(42)
    }).not.to.throw()

    expect(() => {
      expect(42).to.equal(43)
    }).to.throw(/Expected value to equal:.*43.*Received:.*42(?!Difference)/s)

    expect(() => {
      expect([1, 2]).to.equal([1, 3])
    }).to.throw(/Expected value to equal:.*\[1, 3\].*Received:.*\[1, 2\].*Difference.*-\s+3.*\+\s+2/s)
  })

  it('should work for negated shallow equality', () => {
    expect(() => {
      expect(42).not.to.equal(43)
    }).not.to.throw()

    expect(() => {
      expect(42).not.to.equal(42)
    }).to.throw(/Expected value not to equal:.*42.*Received:.*42(?!Difference)/s)

    const arr = [1, 2]
    expect(() => {
      expect(arr).not.to.equal(arr)
    }).to.throw(/Expected value not to equal:.*\[1, 2\].*Received:.*\[1, 2\]/s)
  })

  it('should work for positive deep equality', () => {
    expect(() => {
      expect(42).to.deep.equal(42)
    }).not.to.throw()

    expect(() => {
      expect(42).to.deep.equal(43)
    }).to.throw(/Expected value to deep equal:.*43.*Received:.*42(?!Difference)/s)

    expect(() => {
      expect([1, 2]).to.deep.equal([1, 3])
    }).to.throw(/Expected value to deep equal:.*\[1, 3\].*Received:.*\[1, 2\].*Difference.*-\s+3.*\+\s+2/s)
  })

  it('should work for negative deep equality', () => {
    expect(() => {
      expect(42).not.to.deep.equal(43)
    }).not.to.throw()

    expect(() => {
      expect(42).not.to.deep.equal(42)
    }).to.throw(/Expected value not to deep equal:.*42.*Received:.*42(?!Difference)/s)

    expect(() => {
      expect([1, 2]).not.to.deep.equal([1, 2])
    }).to.throw(/Expected value not to deep equal:.*\[1, 2\].*Received:.*\[1, 2\]/s)
  })

  it('should work for member assertions', () => {
    expect(() => {
      expect([1, 2]).to.have.members([1, 2, 3])
    }).to.throw(/Expected value to have the same members:.*\[1, 2, 3\].*Received:.*\[1, 2\]/s)
  })

  it('should work for ordered member assertions', () => {
    expect(() => {
      expect([1, 2]).to.have.ordered.members([2, 1])
    }).to.throw(/Expected value to have the same ordered members:.*\[2, 1\].*Received:.*\[1, 2\]/s)
  })

  it('should work for contained member assertions', () => {
    expect(() => {
      expect([1]).to.include.members([1, 2])
    }).to.throw(/Expected value to be a superset of:.*\[1, 2\].*Received:.*\[1\]/s)
  })

  it('should work for negated member assertions', () => {
    expect(() => {
      expect([1, 2]).not.to.have.members([1, 2])
    }).to.throw(/Expected value to not have the same members:.*\[1, 2\].*Received:.*\[1, 2\]/s)

    expect(() => {
      expect([1, 2]).not.to.have.ordered.members([1, 2])
    }).to.throw(/Expected value to not have the same ordered members:.*\[1, 2\].*Received:.*\[1, 2\]/s)

    expect(() => {
      expect([1]).not.to.include.members([1])
    }).to.throw(/Expected value to not be a superset of:.*\[1\].*Received:.*\[1\]/s)
  })
})
