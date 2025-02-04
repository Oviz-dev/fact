export const saveApprovalFlow = async (entityId: string, flow: any) => {
  console.log('Mock save:', { entityId, flow });
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true }), 500)
  );
};

export const fetchUsers = async () => {
  return [
    { id: '1', name: 'Олег' },
    { id: '2', name: 'Роман' },
    { id: '3', name: 'Илья' }
  ];
};