export async function inviteUser(payload: any) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(payload),
  };

  const response = await fetch(`/auth/invite/${payload.inviteId}`, options);
  const data = await response.json();

  return data;
}

export async function signIn(payload: any) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(payload),
  };

  const response = await fetch(`/auth/signin`, options);
  const data = await response.json();

  return data;
}

export async function signUp(payload: any) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(payload),
  };

  const response = await fetch(`/auth/signup`, options);
  const data = await response.json();

  return data;
}

export async function getTeammates(projectId: string) {
  const response = await fetch(`/teammates/project/${projectId}/settings/teammates`);
  const data = await response.json();

  return data;
}

export async function incomingMessagesFetch(payload: {
  projectId: string,
  clientId: string,
  successCallback: (data: any) => void
}) {
  let response;
  const { clientId, projectId, successCallback } = payload;

  if (clientId) {
    response = await fetch(`/inbox/project/${projectId}/chat/${clientId}/getMessagesHistory`);
  } else {
    response = await fetch(`/inbox/project/${projectId}/getMessagesHistoryByProject`);
  }

  const data = await response?.json();

  return data;
}

export async function selectedClientInfoGet(payload: {
  projectId: string,
  clientId: string,
  successCallback: (data: any) => void,
}) {
  const { projectId, clientId } = payload;

  const response = await fetch(`/inbox/project/${projectId}/client/${clientId}/getClientInfo`);
  const data = await response.json();

  return data;
}

export async function messageToInboxAdd(payload: any) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(payload),
  };

  const response = await fetch(`/inbox/addMessage`, options);
  const data = await response.json();

  return data;
}

export async function assignedUserUpdate(payload: {
  clientId: string,
  username: string,
  email: string,
  projectId: string,

  assignedClientIds: string[],
  assignedCount: number,

  unreadClientIds: string[],
  unreadCount: number,

  openedClientIds: string[],
  openedCount: number,

  closedClientIds: string[],
  closedCount: number,
  successCallback?: () => void,
}) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: myHeaders
  };

  const response = await fetch(`/inbox/project/${payload.projectId}/updateAssignedUser`, options);
  const data = await response.json();

  return data;
}

export async function selectedClientUpdate(payload: any) {
  const { avatarName, email, phone, assigned_to, projectId, clientId } = payload;

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var options = {
    method: 'POST',
    body: JSON.stringify({ avatarName, email, phone, assigned_to }),
    headers: myHeaders
  };

  const response = await fetch(`/inbox/project/${projectId}/client/${clientId}/update`, options);
  const data = await response.json();

  return data;
}

export async function teammateAdd(payload: {
  email: string,
  projectId?: string,
  role: string,
  status: string,
  username: string,
}) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: myHeaders,
  };

  await fetch(`/teammates/project/${payload.projectId}/settings/teammates/addTeammate`, options);
}

export async function removeTeammate(payload: {email: string, projectId: string}) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var urlencoded = new URLSearchParams();
  urlencoded.append('email', payload.email);

  var options = {
    method: 'DELETE',
    headers: myHeaders,
    body: urlencoded,
  };

  const response = await fetch(`/teammates/project/${payload.projectId}/settings/teammates/deleteTeammate`, options);
  const data = await response.json();

  return data.channels;
}

export async function sendEmail(payload: {
  email: string,
  projectId: string,
}) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: myHeaders
  };

  await fetch(`/auth/project/${payload.projectId}/sendEmail`, options);
}

export async function getChannels(projectId: string) {
  const response = await fetch(`/inbox/project/${projectId}/getChannels`);
  const data = await response.json();

  return data.channels;
}

export async function channelAdd(payload: { projectId: string, name: string }) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append('name', payload.name);

  var options = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  const response = await fetch(`/inbox/project/${payload.projectId}/addChannel`, options);
  const data = await response.json();

  return data;
}