import { CHANNELS, CHANNEL } from '../constants/channels';
import cloneDeep from 'lodash/cloneDeep';

interface Channel {
  name: string
}

interface Settings {
  chatName: string,
  greeting: string,
  backgroundImage: number,
  buttonLocation: string,
  buttonScale: string,
  buttonText: string,
  infochatLinkEnabled: number,
  customCss: string,
}

interface State {
  channels: Channel[],
  settings: Settings,
}

const initialState: State = {
  channels: [],
  settings: {
    chatName: 'Чат на сайте',
    greeting: '',
    backgroundImage: 1,
    buttonLocation: 'right',
    buttonScale: '1',
    buttonText: '',
    infochatLinkEnabled: 1,
    customCss: '',
  },
};

export const channelsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CHANNELS.ADD:
      return {
        ...state,
        channels: action.channels
      };

    case CHANNEL.ADD:
      return {
        ...state,
        channels: [...state.channels, { name: action.payload.name, status: 'pending' }]
      };

    case CHANNELS.UPDATE_SETTINGS:
      const updatedSettings = {
        settings: Object.assign(state.settings, action.payload),
      };

      return cloneDeep(Object.assign(state, updatedSettings));

    default:
      return state;
  }
}