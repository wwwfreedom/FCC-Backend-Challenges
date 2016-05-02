// Constants

// Action Creators
// export const actions = { }

// Reducer
const initialState = {}
// Actions Handlers
const ACTION_HANDLERS = {
  constant: (state, action) => ({

  })
}

export default function <%= pascalEntityName %>(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
