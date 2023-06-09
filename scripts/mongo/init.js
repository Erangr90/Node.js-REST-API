rs.status();
if (rs.isMaster().ismaster) {
    db.createUser({user: 'admin', pwd: 'admin', roles: [ { role: 'root', db: 'admin' } ]});
} else {
    print('Error: Not connected to primary. User creation skipped.');
}