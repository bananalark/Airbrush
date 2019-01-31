import {expect} from 'chai'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import paintToolsReducer, {
  getCommand,
  toggleDraw,
  toggleErase,
  toggleVoice
} from './paintTools'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('paintTools reducer', () => {
  it('should return the initial state', () => {
    expect(paintToolsReducer(undefined, {})).to.be.deep.equal({
      currentCommand: '',
      eraseModeOn: false,
      voiceModeOn: false,
      drawModeOn: false
    })
  })

  it('should toggle the requested tool', () => {
    expect(paintToolsReducer({}, {type: 'TOGGLE_ERASE'})).to.be.deep.equal({
      eraseModeOn: true
    })
    expect(paintToolsReducer({}, {type: 'TOGGLE_DRAW'})).to.be.deep.equal({
      drawModeOn: true
    })
    expect(paintToolsReducer({}, {type: 'TOGGLE_VOICE'})).to.be.deep.equal({
      voiceModeOn: true
    })
  })
})

describe('action creators', () => {
  let store

  const initialState = {
    currentCommand: '',
    eraseModeOn: false,
    voiceModeOn: false,
    drawModeOn: false
  }

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('GET_COMMAND', () => {
    it('eventually dispatches the GET_COMMAND action', async () => {
      const fakeCommand = 'PAINT EVERYTHING!!'
      // mockAxios.onGet('/api/experiences/999').replyOnce(200, fakeExperience)
      await store.dispatch(getCommand(fakeCommand))
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('GET_COMMAND')
      expect(actions[0].command).to.be.deep.equal(fakeCommand)
    })
  })

  describe('toggles all tools', () => {
    it('when toggles dispatch, they... successfully toggle!', async () => {
      await store.dispatch(toggleVoice())
      const actions = store.getActions()
      console.log(store.getActions())
      expect(actions[0].type).to.be.equal('TOGGLE_VOICE')
      // console.log('AFTER----->', initialState)
      // expect(store.voiceModeOn).to.be.equal(true)
    })
  })
})
