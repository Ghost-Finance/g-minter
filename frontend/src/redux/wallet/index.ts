export const Types = {
    SET_LOAD: '@WALLET/SET_LOAD'
}

type TState = {
    loading?: boolean
}

type TAction = {
    type: string
} & TState;

const initialState:TState = {
    loading: false
}

export default (state:TState=initialState, action: TAction) => {
    const { type, loading } = action;
    switch(type){
        case Types.SET_LOAD:
            return {
                ...state,
                loading
            }
        default:
            return state;
    }
}