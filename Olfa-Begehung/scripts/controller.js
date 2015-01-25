/*
 * Copyright (c) Microsoft Open Technologies, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 */
var ctr = {

    itemCounter: 0,
    itemMax: 3,
    itemRuns: -1,
    itemStart: null,
    itemEnd:null,
    initialize: function () {
        this.bindEvents();
        this.initDatabase();
    },

    initDatabase: function () {
        $.when(db_factory.initDatabase()).done(function (res) {
            console.log("Datenbank erfolgreich initialisiert");
        }).fail(function (error) { alert("Fehler Datenbank"); });
    },

    //startBegehungPage
    sb_initPage: function () {
        $("#sb_forms_lv").empty();
        ctr.sb_showLocalForms();
    },

    sb_showLocalForms: function () {
        $.when(db_factory.getLocalForms()).done(function (formList) {
            if (formList != null && formList.length > 0) {
                console.log(formList.length + " forms received")
                ctr.sb_fillLocalForms_lv(formList);
            }
            else $("#sb_message_div").text("keine Daten vorhanden");
        }).fail(function (error) {
            $("#sb_message_div").text("keine Daten vorhanden");
            console.log(error);
        });
    },

    sb_fillLocalForms_lv: function (formList) {
        var listContainer = $("#sb_forms_lv");
        listContainer.empty();

        for (var i = 0; i < formList.length; i++) {
            listContainer.append(
                    '<li><a href="#" onclick="ctr.sb_startBegehung(\'' + formList[i].id + '\')" class="ui-btn ui-shadow ui-corner-all"'
                            + 'data-rowid="' + formList[i].id + '"'
                            + '<h2>' + formList[i].name + '</h2>'
                            + '<p>' + formList[i].raster + '</p>'
                            + '<p>' + formList[i].erstelldatum + '</p>'
                            + '</a>' + '</li>');
        }
        listContainer.listview("refresh");
        listContainer.show();
    },

    sb_startBegehung: function (id) {
        $.when(db_factory.getLocalForm(id)).done(function (form) {
            if (form != null) {
                console.log("data loaded");
                if ((data_controller.initFromForm(form))) {
                    $.mobile.changePage("#begehungHauptPage");
                    console.log("Formular erfolgreich initialisiert");
                }
                else {
                    $("#sb_message_div").text("Fehler beim Laden des Foemulars");
                    console.log("Fehler beim Laden des Formulars");
                }
            }
            else $("#sb_message_div").text("Fehler beim Laden des Formulars");
        }).fail(function (error) {
            $("#sb_message_div").text("Fehler beim Laden des Formulars");
            console.log(error);
        });
    },

    //continueBegehungPage
    cb_initPage: function () {
        $("#cb_forms_lv").empty();
        ctr.cb_showLocalUnfinishedBegehungen();
    },
    cb_showLocalUnfinishedBegehungen: function () {
        $.when(db_factory.getLocalUnfinishedBegehungen()).done(function (begehungList) {
            if (begehungList != null && begehungList.length > 0) {
                console.log(begehungList.length + " begehungen received")
                ctr.cb_fillLocalUnfinishedBegehungen_lv(begehungList);
            }
            else $("#cb_message_div").text("keine Begehungen vorhanden");
        }).fail(function (error) {
            $("#cb_message_div").text("keine Begehungen vorhanden");
            console.log(error);
        });
    },

    cb_fillLocalUnfinishedBegehungen_lv: function (begehungList) {
        var listContainer = $("#cb_forms_lv");
        listContainer.empty();

        for (var i = 0; i < begehungList.length; i++) {
            listContainer.append(
                    '<li><a href="#" onclick="ctr.cb_continueBegehung(\'' + begehungList[i].id + '\')" class="ui-btn ui-shadow ui-corner-all"'
                            + 'data-rowid="' + begehungList[i].id + '"'
                            + '<p><h3 style="float:left;width:50%">' + begehungList[i].name + '</h3><h3 style="float:right;width:50%">' + begehungList[i].raster + '</h3></p>'
                            + '<p><div style="float:left;width:50%;font-size:small">1.Punkt</div><div style="float:right;width:50%;font-size:small">letzter.Punkt</div></p>'
                            + '<p><div style="float:left;width:50%;font-size:small">' + new Date(begehungList[i].begin).toLocaleDateString("de") + " " + new Date(begehungList[i].begin).toLocaleTimeString("de") + '</div><div style="float:right;width:50%;font-size:small">' + new Date(begehungList[i].ende).toLocaleDateString("de") + " " + new Date(begehungList[i].ende).toLocaleTimeString("de") + '</div></p>'
                            + '</a>' + '</li>');
        }
        listContainer.listview("refresh");
        listContainer.show();
    },

    cb_continueBegehung: function (id) {
        $.when(db_factory.getLocalBegehung(id)).done(function (begehung) {
            if (begehung != null) {
                console.log("data loaded");
                if ((data_controller.initFromBegehung(begehung))) {
                    $.mobile.changePage("#begehungHauptPage");
                    console.log("Formular erfolgreich initialisiert");
                }
                else {
                    $("#sb_message_div").text("Fehler beim Laden des Foemulars");
                    console.log("Fehler beim Laden des Formulars");
                }
            }
            else $("#sb_message_div").text("Fehler beim Laden des Formulars");
        }).fail(function (error) {
            $("#sb_message_div").text("Fehler beim Laden des Formulars");
            console.log(error);
        });
    },

    //uploadBegehungPage
    ub_initPage: function () {
        $("#ub_forms_lv").empty();
        ctr.ub_showLocalFinishedBegehungen();
    },
    ub_showLocalFinishedBegehungen: function () {
        $.when(db_factory.getLocalFinishedBegehungen()).done(function (begehungList) {
            if (begehungList != null && begehungList.length > 0) {
                console.log(begehungList.length + " begehungen received")
                ctr.ub_fillLocalFinishedBegehungen_lv(begehungList);
            }
            else $("#ub_message_div").text("keine Begehungen vorhanden");
        }).fail(function (error) {
            $("#ub_message_div").text("keine Begehungen vorhanden");
            console.log(error);
        });
    },

    ub_fillLocalFinishedBegehungen_lv: function (begehungList) {
        var listContainer = $("#ub_forms_lv");
        listContainer.empty();

        for (var i = 0; i < begehungList.length; i++) {
            listContainer.append(
                    '<li><a href="#" onclick="ctr.cb_continueBegehung(\'' + begehungList[i].id + '\')" class="ui-btn ui-shadow ui-corner-all"'
                            + 'data-rowid="' + begehungList[i].id + '"'
                            + '<p><h3 style="float:left;width:50%">' + begehungList[i].name + '</h3><h3 style="float:right;width:50%">' + begehungList[i].raster + '</h3></p>'
                            + '<p><div style="float:left;width:50%;font-size:small">1.Punkt</div><div style="float:right;width:50%;font-size:small">letzter.Punkt</div></p>'
                            + '<p><div style="float:left;width:50%;font-size:small">' + new Date(begehungList[i].begin).toLocaleDateString("de") + " " + new Date(begehungList[i].begin).toLocaleTimeString("de") + '</div><div style="float:right;width:50%;font-size:small">' + new Date(begehungList[i].ende).toLocaleDateString("de") + " " + new Date(begehungList[i].ende).toLocaleTimeString("de") + '</div></p>'
                            + '</a>' + '</li>');
        }
        listContainer.listview("refresh");
        listContainer.show();
    },

    //begehungHauptPage
    bhp_initPage: function () {
        var tableString = "";
        var headerString = "";
        
        headerString += '<p><h3 style="float:left;width:50%">' + data_controller.begehung.name + '</h3><h4 style="float:right;with:50%">' + data_controller.begehung.raster + '</h4></p>' +
                        '<p style="clear:left;font-style:italic">' + data_controller.begehung.beschreibung + '</p>';

        $("#bhp_header_div").html(headerString);

        $("#bhp_punkte_tbl tbody").empty();
        $(data_controller.$kml).find("Placemark").each(function (i) {
            var startStr = $(this).find('start').text();
            var endStr = $(this).find('end').text();

            tableString += '<tr>' +
                '<td>' + $(this).find('name').text() + '</td>' +
                '<td>' + $(this).find('description').text() + '</td>' +
                '<td style="font-size:small;padding:0px">';
            if ($(this).attr("status") >0) tableString += ctr.getEindrueckeString($(this).find('items').text());
            tableString += '</td>' +
            '<td>';
            if (startStr != "") tableString += new Date(startStr).toLocaleDateString("de") + "<br/>" + new Date(startStr).toLocaleTimeString("de");
            tableString += '</td>' +
                '<td>';
            if (endStr != "") tableString += new Date(endStr).toLocaleDateString("de") + "<br/>" + new Date(endStr).toLocaleTimeString("de");
            tableString += '</td>' +
                '<td>';
            if ($(this).attr("status") == 1) tableString += '<a class="ui-btn ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-b ui-btn-inline" href="#">Check</a>';
            if ($(this).attr("status") == 0) tableString += '<a href="#" onclick="ctr.bhp_showPlacemarkPage(\'' + $(this).attr("id") + '\')" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-right ui-icon-carat-r">start</a>';

            tableString += '</td>' +
         '</tr>';
        });
        $("#bhp_punkte_tbl tbody").append(tableString);
    },

    bhp_showPlacemarkPage: function (id) {
        var flag1 = false;
        var flag2 = false;
        if ($("#bhp_vornameProband_inp") != null && $("#bhp_vornameProband_inp").val() != "") {flag1 = true;}
        else { flag1 = false; $("#bhp_vornameProband_err").text("Bitte Vornamen eingeben!").show().fadeOut(5000); };
        if ($("#bhp_nachnameProband_inp") != null && $("#bhp_nachnameProband_inp").val() != "") { flag2 = true; }
        else { flag2 = false; $("#bhp_nachnameProband_err").text("Bitte Namen eingeben!").show().fadeOut(5000); };

        if (flag1 && flag2) {
            $("#pmp_selectedPlacemark_ip").val(id);
            $.mobile.changePage("#placemarkPage");
        }
    },

    //placemarkPage
    pmp_initPage: function () {
        var headerString = '';
        var id = $("#pmp_selectedPlacemark_ip").val();
        var vorname = $("#bhp_vornameProband_inp").val();
        var nachname = $("#bhp_nachnameProband_inp").val();
        var placemark = $(data_controller.$kml).find("Placemark[id='" + id + "']");

        ctr.itemRuns = -1;
        ctr.itemStart = null;
        ctr.itemEnd = null;

        headerString += '<p><div style="float:left;width:50%">' + data_controller.begehung.name + '</div><div style="float:right;with:50%">' + data_controller.begehung.raster + '</div></p>' +
                '<p><div style="float:left;width:50%">' + $(placemark).find("name").text() + '</div><div style="float:right;with:50%">' + vorname+' '+nachname + '</div></p>'+
                '<p style="clear:left;font-style:italic">' + $(placemark).find("description").text() + '</p>';
        $("#pmp_header_div").html(headerString);

        $("#pmp_werte_tbl tbody").empty();
        $("#pmp_message_div").hide();
        $("#pmp_err_div").hide();
    },

    pmp_startPlacemark: function () {
        ctr.itemStart = new Date().toUTCString();
        if (data_controller.begehung.begin == null) data_controller.begehung.begin = ctr.itemStart;
        ctr.itemRuns = 1;
        ctr.itemCounter = 0;
        ctr.pmp_addLine(ctr.itemCounter);
        ctr.pmp_runPlacemark(10);
        $("#pmp_message_div").show();
        $("#pmp_message_div").html("gestartet");
    },

    pmp_runPlacemark: function (counter) {
        setTimeout(function () {
            if (ctr.itemCounter < ctr.itemMax) {
                if (counter > 0) {
                    $("#itemValue" + (ctr.itemCounter)).html(counter);
                    counter;
                    ctr.pmp_runPlacemark(counter - 1);
                }
                else {
                    ctr.pmp_checkPlacemarkValue(ctr.itemCounter);
                    if (ctr.itemRuns==1) {
                        $("#itemValue" + (ctr.itemCounter)).empty();
                        ctr.itemCounter++;
                        if (ctr.itemCounter < ctr.itemMax) {
                            ctr.pmp_addLine(ctr.itemCounter);
                        }
                        else ctr.pmp_finishPlacemark();
                        ctr.pmp_runPlacemark(10);
                    }
                };
            }
        }, 100);
    },

    pmp_addLine: function (line) {
        var tableString = '';
        var rowBackground = (line % 2) > 0 ? "#efefef" : "#f5f5f5";

        tableString += '<tr style="background-color:' + rowBackground + '">' +
                '<td>' + line + '</td>' +
                '<td><div id="itemValue' + line + '"></div></td>' +
            '<td style="padding:2">' +
            '<fieldset class="geruch_cg" data-role="controlgroup" data-type="horizontal" id="geruch_cg' + ctr.itemCounter + '" style="margin:0">';
        $(data_controller.$gerueche).find("geruch").each(function (i, geruch) {
            tableString += '<input name="geruch_rad' + ctr.itemCounter + '" id="geruch_rad' + ctr.itemCounter + '_' + i + '" data-id="'+ctr.itemCounter+'" type="radio" value="' + $(geruch).attr("krz") + '">';
            tableString += '<label for="geruch_rad' + ctr.itemCounter + '_' + i + '">' + $(geruch).attr("krz") + '</label>';
        });
        tableString += '</fieldset>' +
        '</td>' +
    '</tr>';
        $("#pmp_werte_tbl tbody").append(tableString);
        $('#geruch_cg' + ctr.itemCounter).controlgroup();
    },

    pmp_checkPlacemarkValue: function (itemNumber) {
        var value = $("#geruch_cg" + itemNumber + " :radio:checked").val();
        if (value != null) return true;
        else {
            ctr.pmp_stopPlacemark();
            return false;
        }
    },

    pmp_geruchCGChanged: function (id) {
        if (ctr.itemRuns==0 && ctr.itemCounter == id) {
            ctr.pmp_continuePlacemark();
        }
    },
    
    pmp_stopPlacemark: function () {
        $("#pmp_message_div").html("gestoppt");
        ctr.itemRuns = 0;
    },
    pmp_continuePlacemark: function () {
        $("#pmp_message_div").html("gestartet");
        ctr.itemRuns = 1;
        ctr.pmp_runPlacemark(10);
    },
    pmp_finishPlacemark: function () {
        $("#pmp_message_div").html("beendet");
        ctr.itemEnd = new Date().toUTCString();
        ctr.itemRuns = 2;
        data_controller.begehung.ende = ctr.itemEnd;
    },
    pmp_savePlacemark: function () {
        var flag1 = false;
        var itemString = '';
        var id = $("#pmp_selectedPlacemark_ip").val();
        var placemark = $(data_controller.$kml).find("Placemark[id='" + id + "']");

        if (ctr.itemRuns == 2) flag1 = true;
        if (ctr.itemRuns == 0) {
            flag1 = false;
            $("#pmp_err_div").text("Messung ist noch nicht beendet").show().fadeOut(5000);
        };

        if (flag1) {
            itemString += $("#geruch_cg" + 0 + " :radio:checked").val();
            for (var i = 1; i < ctr.itemMax; i++) {
                itemString += ';' + $("#geruch_cg" + i + " :radio:checked").val();
            };
        $(placemark).find("items").text(itemString);
        $(placemark).attr("status", 1);
        $(placemark).find("vorname").text($("#bhp_vornameProband_inp").val());
        $(placemark).find("nachname").text($("#bhp_nameProband_inp").val());
        $(placemark).find("start").text(ctr.itemStart);
        $(placemark).find("end").text(ctr.itemEnd);
        
        //alert("id:"+data_controller.begehung.id+" status:"+data_controller.begehung.status);
        if (data_controller.isFinishedBegehung()) data_controller.begehung.status = 2;
            //save begehung
        if (data_controller.begehung.id == -1) ctr.pmp_insertBegehung(data_controller.getBegehung());
        if (data_controller.begehung.id >0) ctr.pmp_updateBegehung(data_controller.getBegehung());
        }
    },

    pmp_insertBegehung: function (begehung) {
        $.when(db_factory.insertBegehung(begehung)).done(function (res) {
            if (res.insertId != null) {
                console.log("Begehung inserted.Row inserted:" + res.insertId);
                data_controller.begehung.id = res.insertId;
                $.mobile.changePage("#begehungHauptPage");
            }
            else { $("#pmp_err_div").show().text("Fehler beim Speichern"); }
        }).fail(function (error) {
            $("#pmp_err_div").show().text("Fehler beim Speichern");
            console.log(error);
        });
    },

    pmp_updateBegehung: function (begehung) {
        $.when(db_factory.updateBegehung(begehung)).done(function (res) {
            if (res.rowsAffected != null && res.rowsAffected > 0) {
                console.log("Begehung"+begehung.id+" updated.Rows affected:" + res.rowsAffected);
                $.mobile.changePage("#begehungHauptPage");
            }
            else { $("#pmp_err_div").show().text("Fehler beim Speichern"); }
        }).fail(function (error) {
            $("#pmp_err_div").show().text("Fehler beim Speichern");
            console.log("Fehler beim Speichern von "+begehung.id+" "+error);
        });
    },

    //adminFormsPage
    af_showLocalForms: function () {
        $("#af_forms_lv").empty();
        $.when(db_factory.getLocalForms()).done(function (formList) {
            if (formList != null && formList.length > 0) {
                ctr.af_fillLocalForms_lv(formList);
            }
            else $("#af_message_div").text("keine Daten vorhanden");
        }).fail(function (error) {
            $("#af_message_div").text("keine Daten vorhanden");
            console.log(error);
        });
    },

    af_fillLocalForms_lv: function (formList) {
        var listContainer = $("#af_forms_lv");

        for (var i = 0; i < formList.length; i++) {
            listContainer.append(
                    '<li><a href="#" onclick="ctr.af_confirmDeleteForm(\'' + formList[i].id + '\')" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-right ui-icon-delete"'
                            + 'data-rowid="' + formList[i].id + '"'
                            + '<h2>' + formList[i].name + '</h2>'
                            + '<p>' + formList[i].raster + '</p>'
                            + '<p>' + formList[i].erstelldatum + '</p>'
                            + '</a>' + '</li>');
        }
        listContainer.listview("refresh");
        listContainer.show();
    },
    af_confirmDeleteForm: function (id) {
        if (id > 0) {
            $("#af_selectedLocalForm_ip").val(id);
            $("#af_confirmDelete_pu").popup("open");
        }
    },

    af_deleteForm: function () {
        var id = $("#af_selectedLocalForm_ip").val();
        if (id != null && id > 0) {
            $.when(db_factory.deleteForm(id)).done(function (rowsAffected) {
                console.log(rowsAffected);
                $("#af_confirmDelete_pu").popup("close");
                ctr.af_showLocalForms();
            }).fail(function (error) { console.log(error); $("#af_confirmDelete_pu").popup("close"); $("#af_error_div").text("Fehler beim Löschen"); });
        }
    },

    af_clearDatabase: function () {
        db_factory.clearDatabase();
        $("#af_confirmClearDatabase_pu").popup("close");
        ctr.af_showLocalForms();
    },

    //downloadFormPage
    dlf_initPage:function(){
        $("#dlf_message_div").empty();
        $("#dlf_selectedServerForm_ip").val("");
        ctr.dlf_showServerForms();
    },

    dlf_showServerForms: function () {
        ctr.showLoader();
        $.when(gd_factory.getForms()).done(function (formList) {
            ctr.hideLoader();
            console.log('data received from google drive:' + formList.length + 'rows');
            if (formList.length > 0) ctr.dlf_fillServerForms_lv(formList);
        }).fail(function (error) { ctr.hideLoader(); console.log(error); $("#dlf_message_div").text("Serverdaten konnten nicht abgerufen werden"); });
    },

    dlf_fillServerForms_lv: function (formList) {
        var listContainer = $("#dlf_forms_lv");
        listContainer.empty();

        for (var i = 0; i < formList.length; i++) {
            listContainer.append(
                    '<li><a href="#" onclick="ctr.dlf_confirmDownloadForm(\'' + formList[i].id + '\')" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-right ui-icon-cloud"'
                            + 'data-rowid="' + formList[i].id + '"'
                            + '<h2>' + formList[i].name + '</h2>'
                            + '<p>' + formList[i].raster + '</p>'
                            + '<p>' + formList[i].erstelldatum + '</p>'
                            + '</a>' + '</li>');
        }
        listContainer.listview("refresh");
        listContainer.show();
    },

    dlf_confirmDownloadForm: function (id) {
        if (id > 0) {
            $("#dlf_selectedServerForm_ip").val(id);
            $("#dlf_confirmDownload_pu").popup("open");
        }
    },

    dlf_downloadForm: function () {
        ctr.showLoader();
        var id = $("#dlf_selectedServerForm_ip").val();
        $.when(gd_factory.getForm(id)).done(function (form) {
            ctr.hideLoader();
            if (form != null) { console.log('data received from google drive:'); ctr.dlf_addForm(form); }
        }).fail(function (error) { console.log(error); ctr.hideLoader(); $("#dlf_message_div").text("Serverdaten konnten nicht abgerufen werden"); });
    },

    dlf_addForm: function (form) {
        $.when(db_factory.addForm(form)).done(function (res) {
            console.log(res.insertId);
            $.mobile.changePage("#adminFormsPage");
        }).fail(function (error) {
            console.log(error);
            $("#dlf_message_pu p").html("Fehler beim Speichern");
            $("#dlf_message_pu").popup("open");
        });
    },

    //addManualFormPage
    amf_initPage:function(){
        $("#af_message_div").empty();
        $("#af_selectedLocalForm_ip").val("");
        ctr.af_showLocalForms();
    },

    amf_addForm: function () {
        var form = {
            name: $("#amf_Name_txt").val(),
            beschreibung: $("#amf_Description_txt").val(),
            raster: $("#amf_Raster_txt").val(),
            kml: $("#amf_KML_ta").val(),
            gerueche: $("#amf_Gerueche_ta").val(),
            erstelldatum: new Date().toUTCString()
        };
        $.when(db_factory.addForm(form)).done(function (res) {
            console.log(res.insertId);
            $.mobile.changePage("#adminFormsPage");
        }).fail(function (error) { console.log(error); $("#amf_message_div").html("Fehler beim Speichern"); });
    },




    //helper
    showLoader: function () {
        $.mobile.loading("show", {
            text: "Daten werden geladen",
            textVisible: true,
            theme: "z",
            html: ""
        });
    },
    hideLoader: function () {
        $.mobile.loading("hide");
    },


    getEindrueckeString: function (items) {
        var eindrueckeString = "";
        var matrix = [];
        $(data_controller.$gerueche).find("geruch").each(function (index, element) {
            var gItem = {};
            gItem.geruch = $(element).attr("krz");
            gItem.c = 0;
            matrix.push(gItem);
        });
        $.each(items.split(";"),function (iEindruck, eindruck) {
            $.each(matrix, function (indexG, gItem) {
                if (gItem.geruch == eindruck) gItem.c++;
            });
        });
        //output
        eindrueckeString += "<table class='gerTable'><tr>"
        $.each(matrix, function (indexG, gItem) {
            eindrueckeString += "<td>"+gItem.geruch + "</td>";
        });
        eindrueckeString += "</tr><tr>";
        $.each(matrix, function (indexG, gItem) {
            eindrueckeString += "<td>" + gItem.c + "</td>";
        });
        eindrueckeString += "</tr></table>";
        return eindrueckeString;
    },

    occurrences: function (str, value) {
        var regExp = new RegExp(value, "gi");
        return str.match(regExp) ? str.match(regExp).length : 0;
},

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        //startBegehungPage
        $(document).on('pageshow', '#startBegehungPage', function (event, ui) {
            ctr.sb_initPage();
        });
        //continueBegehungPage
        $(document).on('pageshow', '#continueBegehungPage', function (event, ui) {
            ctr.cb_initPage();
        });
        //uploadBegehungPage
        $(document).on('pageshow', '#uploadBegehungPage', function (event, ui) {
            ctr.ub_initPage();
        });
        //begehungHauptPage
        $(document).on('pageshow', '#begehungHauptPage', function (event, ui) {
            ctr.bhp_initPage();
        });
        //placemarkPage
        $(document).on('pageshow', '#placemarkPage', function (event, ui) {
            ctr.pmp_initPage();
        });
        $(document).on('tap', '#pmp_startPlacemark_btn', function () {
            if(ctr.itemRuns==0) ctr.pmp_continuePlacemark();
            if (ctr.itemRuns == -1) ctr.pmp_startPlacemark();
        });
        $(document).on('tap', '#pmp_stopPlacemark_btn', function () {
            if (ctr.itemRuns == 1) ctr.pmp_stopPlacemark();
        });
        $(document).on('tap', '#pmp_savePlacemark_btn', function () {
            ctr.pmp_savePlacemark();
        });

        $(document).on('change', '.geruch_cg', function (event) {
            var id = $(event.target).attr("data-id");
            if(id!=null && id>-1)ctr.pmp_geruchCGChanged(id);
        });

        //adminFormsPage
        $(document).on('pageshow', '#adminFormsPage', function (event, ui) {
            ctr.amf_initPage();
        });
        $(document).on('tap', '#af_deleteForm_btn', function () {
            ctr.af_deleteForm();
        });
        $(document).on('tap', '#af_cleanDatabase_btn', function () {
            ctr.af_clearDatabase();
        });

        //addManualFormPage
        $(document).on('pageshow', '#addManualFormPage', function (event, ui) {
            $("#amf_message_div").empty();
        });

        $(document).on('tap', '#amf_addForm_btn', function () {
            ctr.amf_addForm();
        });

        //downloadFormPage
        $(document).on('pageshow', '#downloadFormsPage', function (event, ui) {
            ctr.dlf_initPage();
        });
        $(document).on('tap', '#dlf_addForm_btn', function () {
            ctr.dlf_downloadForm();
        });

        //document.getElementById('amf_af_addBegehung_btn').addEventListener('click', ctr.af_addBegehung);



    },


};


