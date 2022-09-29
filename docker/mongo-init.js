const user = {
    user: 'user-iconlake',
    pwd: 'ABCDEFGH12345678_1',
    roles: [
        {
            role: 'readWrite',
            db: 'iconlake'
        }
    ]
};

db.createUser(user);
