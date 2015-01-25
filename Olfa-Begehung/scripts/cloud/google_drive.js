/*
 * Udo Lang 2015
 */
var gd_factory = {
    tableID: '1iJK1u5P2wloiAyo1vBGGbt1-AAPadYskKw43GA9w',
    api_key:'AIzaSyAZX14yLHGoDHYUuxfL9LV6wjhCP_afLV0',

    initialize: function () {
    },

getForms:function() {
    var deferred = $.Deferred();
    var formList = null;
    var query = "SELECT rowid,Name,Beschreibung,Raster,Erstelldatum FROM " + this.tableID;
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v1/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key='+this.api_key);
    url.push('&callback=?');

    // Send the JSONP request using jQuery
    $.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        success: function (data) {
            if (data != null && data['rows'] != null) {
                formList = gd_factory.getFormList(data['rows']);
            }
            else formList = null;
            deferred.resolve(formList);
        },
        error: function (error) {
            deferred.reject(error);
        }
    });
    return deferred.promise();
},

getForm:function(id) {
    var deferred = $.Deferred();
    var form = {};
    var query = "SELECT rowid,Name,Beschreibung,Raster,KML,Gerueche,Erstelldatum FROM " + this.tableID + " WHERE rowid='" + id + "'";
    var encodedQuery = encodeURIComponent(query);
    
    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v1/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key='+this.api_key);
    url.push('&callback=?');

        // Send the JSONP request using jQuery
    $.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        success: function (data) {
            if (data != null && data['rows'] != null) {
                var row = data['rows'][0];
                form.name = row[1];
                form.beschreibung = row[2];
                form.raster = row[3];
                form.kml = row[4];
                form.gerueche = row[5];
                form.erstelldatum = row[6];
            }
            else form = null;
            deferred.resolve(form);
        },
        error: function (error) {
            deferred.reject(error);
        }
    });
    return deferred.promise();
},

getFormList: function (rows) {
    var formList = [];
    var row;
    var form={};
    for (var i = 0; i < rows.length; i++) {
        row = rows[i];
        form.id = row[0];
        form.name = row[1];
        form.beschreibung = row[2];
        form.raster = row[3];
        form.erstelldatum = row[4];
        formList.push(form);
    }
    return formList;
}

};

