export const dummyUserProfile = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'johndoe@example.com',
  gender: 'Male',
  nik: '3507162708990001',
  username: 'johndoe',
  avatar: '/assets/images/profile-unknown.jpg',
  role: 'Admin',
};

export const dummyUserLogs = [
  {
    pkid: 1,
    actor_pkid: 1,
    actor_username: 'johndoe',
    actor_role: 'Admin',
    ip_address: '192.168.1.1',
    office: 'Kantor Pusat',
    activity_time: new Date().toISOString(),
    activity_type: 'LOGIN',
    target_table: 'users',
    target_pkid: 1,
    req_body: null,
  },
  {
    pkid: 2,
    actor_pkid: 1,
    actor_username: 'johndoe',
    actor_role: 'Admin',
    ip_address: '192.168.1.1',
    activity_time: new Date(Date.now() - 86400000).toISOString(), // 1 hari lalu
    activity_type: 'EDIT PROFILE',
    target_table: 'users',
    target_pkid: 1,
    req_body: JSON.stringify({
      username: 'johndoe',
      email: 'johndoe@example.com',
    }),
  },
  {
    pkid: 3,
    actor_pkid: 1,
    actor_username: 'johndoe',
    actor_role: 'Admin',
    ip_address: '192.168.1.1',
    activity_time: new Date(Date.now() - 172800000).toISOString(), // 2 hari lalu
    activity_type: 'REGISTER',
    target_table: 'users',
    target_pkid: 1,
    req_body: null,
  },
];
