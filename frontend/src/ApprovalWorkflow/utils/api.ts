export const saveApprovalInstance = async (flow: any) => {
  console.log('Моковые данные:', {flow});
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true }), 500)
  );
};
// добавить атрибуты из шаблона процесса +тип процесса
export const saveApprovalTemplate = async (flow: any) => {
  console.log('Моковые данные:', {flow});
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