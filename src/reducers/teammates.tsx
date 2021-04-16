import { TEAMMATES, TEAMMATE } from '../constants/teammates';
import cloneDeep from 'lodash/cloneDeep';

interface Teammate {
  avatar: string,
  email: string,
  role: string,
  status: string,
  username: string,
}

interface State {
  teammates: Teammate[],
}

const initialState: State = {
  teammates: [],
};

export const teammatesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TEAMMATE.ADD:
      return {
        ...state,
        teammates: [
          ...state.teammates,
          action.teammate
        ]
      };

    case TEAMMATES.ADD:
      return {
        ...state,
        teammates: action.teammate
      };

    case TEAMMATE.DELETE:
      return {
        ...state,
        teammates: [...state.teammates].filter(teammate => teammate.email !== action.teammate.email)
      };

    default:
      return state;
  }
};