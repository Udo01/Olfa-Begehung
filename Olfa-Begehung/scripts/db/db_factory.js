/*
 * Udo Lang
 * 2015
 */
var db_factory = {

    initialize: function () {
        this.db = null;
    },

    clearDatabase: function () {
        this.removeTable();
        this.initDatabase();
    },

    initDatabase: function () {
        var deferred = $.Deferred();
        this.openDatabase();
        if (db_factory.db != null) {
            $.when(this.createTable()).done(function (res) {
                deferred.resolve(res);
            }).fail(function (error) { deferred.reject(error) });
        }
        else deferred.reject("error opening database");
        return deferred.promise();
    },

    openDatabase: function () {
        
        var dbSize = 5 * 1024 * 1024; // 15MB
        this.db = openDatabase("GeoDB", "", "GeoDB manager", dbSize, function() {
            console.log('db successfully opened or created');
        });
        return this.db;
    },

    createTable: function () {
        var deferred = $.Deferred();
        this.db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS Formulare(ID INTEGER PRIMARY KEY ASC,Name TEXT,Beschreibung TEXT,Raster TEXT,KML TEXT,Gerueche TEXT, Erstelldatum TEXT)");
            tx.executeSql("CREATE TABLE IF NOT EXISTS Begehungen(ID INTEGER PRIMARY KEY ASC,Status INTEGER,Name TEXT,Beschreibung TEXT,Raster TEXT,KML TEXT,Gerueche Text,Formulardatum TEXT,Begin TEXT,Ende TEXT)");
        },
        function (transaction, error) { deferred.reject(error); },
        function (transaction, res) { deferred.resolve(res); }
        );
        return deferred.promise();
    },

//Formulare 
    getLocalForms:function(){
        var deferred = $.Deferred();
        var formList = null;
        this.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Formulare", [],
                function (transaction, res) {
                    if (res.rows != null) {
                        formList = db_factory.getFormList(res.rows)
                    }
                    deferred.resolve(formList);
                }, function (transaction, error) {
                    deferred.reject(error);
                });
        });
        return deferred.promise();
    },

    getLocalForm: function (id) {
        var deferred = $.Deferred();
        var form = {};
        this.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Formulare WHERE ID=?", [id],
                function (transaction, res) {
                    if (res.rows != null && res.rows.item(0) != null) {
                        var item = res.rows.item(0);
                        form.name = item.Name;
                        form.beschreibung = item.Beschreibung;
                        form.raster = item.Raster;
                        form.kml = item.KML;
                        form.gerueche = item.Gerueche;
                        form.erstelldatum = item.Erstelldatum;
                    }
                    else form = null;
                    deferred.resolve(form);
                }, function (transaction, error) {
                    deferred.reject(error);
                });
        });
        return deferred.promise();
    },

    addForm: function (form) {
        var deferred = $.Deferred();
        db_factory.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO Formulare(Name,Beschreibung,Raster,KML,Gerueche,Erstelldatum) VALUES (?,?,?,?,?,?)", [form.name,form.beschreibung,form.raster,form.kml,form.gerueche,form.erstelldatum], function (transaction, res) { deferred.resolve(res); }, function (transaction, error) { deferred.reject(error); });
        });
        return deferred.promise();
    },

    deleteForm: function (id) {
        var deferred = $.Deferred();
        db_factory.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM Formulare WHERE ID=?", [id], function (transaction, res) { deferred.resolve(res.rowsAffected); }, function (transaction, error) { deferred.reject(error); });
        });
        return deferred.promise();
    },

    removeTable: function () {
        db_factory.db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS Formulare', [], function (transaction, res) { console.log("table dropped")}, function (transaction, error) {console.log(error) });
            tx.executeSql('DROP TABLE IF EXISTS Begehungen', [], function (transaction, res) { console.log("table dropped") }, function (transaction, error) { console.log(error) });
            tx.executeSql('DROP TABLE IF EXISTS Begehung', [], function (transaction, res) { console.log("table dropped") }, function (transaction, error) { console.log(error) });
        }
    )
    },

    getFormList: function (rows) {
        var formList = [];
        var row;
        for (var i = 0; i < rows.length; i++) {
            var form = {};
            row = rows.item(i);
            form.id = row.ID;
            form.name = row.Name;
            form.beschreibung = row.Beschreibung;
            form.raster = row.Raster;
            form.erstelldatum = row.Erstelldatum;
            formList.push(form);
        }
        return formList;
    },


    //Begehungen
    insertBegehung: function (begehung) {
        var deferred = $.Deferred();
            db_factory.db.transaction(function (tx) {
                tx.executeSql("INSERT INTO Begehungen(Status,Name,Beschreibung,Raster,KML,Gerueche,Formulardatum,Begin,Ende) VALUES (?,?,?,?,?,?,?,?,?)", [begehung.status, begehung.name, begehung.beschreibung, begehung.raster, begehung.kml,begehung.gerueche, begehung.formulardatum, begehung.begin, begehung.ende], function (transaction, res) { deferred.resolve(res); }, function (transaction, error) { deferred.reject(error); });
            });
        return deferred.promise();
    },

    updateBegehung: function (begehung) {
        var deferred = $.Deferred();
        db_factory.db.transaction(function (tx) {
            tx.executeSql("UPDATE Begehungen Set Status=?,Name=?,Beschreibung=?,Raster=?,KML=?,Gerueche=?,Formulardatum=?,Begin=?,Ende=? WHERE ID=?", [begehung.status, begehung.name, begehung.beschreibung, begehung.raster, begehung.kml,begehung.gerueche, begehung.formulardatum, begehung.begin, begehung.ende,begehung.id], function (transaction, res) { deferred.resolve(res); }, function (transaction, error) { deferred.reject(error); });
        });
    return deferred.promise();
},

    getLocalUnfinishedBegehungen: function () {
        var deferred = $.Deferred();
        var begehungList = null;
        this.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Begehungen WHERE Status='1'", [],
                function (transaction, res) {
                    if (res.rows != null) {
                        begehungList = db_factory.getBegehungList(res.rows);
                    }
                    deferred.resolve(begehungList);
                }, function (transaction, error) {
                    deferred.reject(error);
                });
        });
        return deferred.promise();
},

    getLocalFinishedBegehungen: function () {
        var deferred = $.Deferred();
        var begehungList = null;
        this.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Begehungen WHERE Status='2'", [],
                function (transaction, res) {
                    if (res.rows != null) {
                        begehungList = db_factory.getBegehungList(res.rows);
                    }
                    deferred.resolve(begehungList);
                }, function (transaction, error) {
                    deferred.reject(error);
                });
        });
        return deferred.promise();
    },

    getBegehungList: function (rows) {
    var begehungList = [];
    var row;
    for (var i = 0; i < rows.length; i++) {
        var begehung = {};
        row = rows.item(i);
        begehung.id = row.ID;
        begehung.status = row.Status;
        begehung.name = row.Name;
        begehung.beschreibung = row.Beschreibung;
        begehung.raster = row.Raster;
        begehung.formulardatum = row.Formulardatum;
        begehung.begin = row.Begin;
        begehung.ende = row.Ende;
        begehungList.push(begehung);
    }
    return begehungList;
    },

    getLocalBegehung: function (id) {
        var deferred = $.Deferred();
        var begehung = {};
        this.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM Begehungen WHERE ID=?", [id],
                function (transaction, res) {
                    if (res.rows != null && res.rows.item(0) != null) {
                        var item = res.rows.item(0);
                        begehung.id = item.ID;
                        begehung.name = item.Name;
                        begehung.beschreibung = item.Beschreibung;
                        begehung.raster = item.Raster;
                        begehung.formulardatum = item.Formulardatum;
                        begehung.begin = item.Begin;
                        begehung.ende = item.Ende;
                        begehung.kml = item.KML;
                        begehung.gerueche = item.Gerueche;
                    }
                    else form = null;
                    deferred.resolve(begehung);
                }, function (transaction, error) {
                    deferred.reject(error);
                });
        });
        return deferred.promise();
    },
};

