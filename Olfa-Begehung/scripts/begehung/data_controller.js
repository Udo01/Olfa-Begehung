/*
 * Udo Lang 2015
 */
var data_controller = {
    begehung: {
        id:-1,
        status:null,
        name: null,
        raster: null,
        beschreibung:null,
        formulardatum: null,
        begin:null,
        ende: null,
        kml: null,
        gerueche:null
    },

    $kml: null,
    $gerueche: null,

    initFromForm: function (form) {
        var init = false;
            this.begehung.id = -1;
            if (form.name != null && form.name != '') { this.begehung.name = form.name; init = true; } else int = false;
            if (form.raster != null && form.raster!= '') { this.begehung.raster= form.raster; init = true; } else int = false;
            this.begehung.beschreibung = form.beschreibung;
            this.begehung.formulardatum = form.erstelldatum;
            if (!this.initNewKml(form.kml))init=false;
            if (!this.initGerueche(form.gerueche)) init = false;
            if (init) { this.begehung.status = 1; }
            else this.begehung.status = -1;
        return init;
        //alert(this.getXmlAsString(this.$kml[0]));
    },

    initFromBegehung: function (loadedBegehung) {
        var init = false;
        if (loadedBegehung.id != null && loadedBegehung.id != '') { this.begehung.id = loadedBegehung.id; init = true; } else int = false;
        if (loadedBegehung.name != null && loadedBegehung.name != '') { this.begehung.name = loadedBegehung.name; init = true; } else int = false;
        if (loadedBegehung.raster != null && loadedBegehung.raster != '') { this.begehung.raster = loadedBegehung.raster; init = true; } else int = false;
        this.begehung.beschreibung = loadedBegehung.beschreibung;
        this.begehung.formulardatum = loadedBegehung.formulardatum;
        if (!this.initLoadedKml(loadedBegehung.kml)) init = false;
        if (!this.initGerueche(loadedBegehung.gerueche)) init = false;
        if (init) { this.begehung.status = 1; }
        else this.begehung.status = -1;

        return init;
    },
    initNewKml: function (kml) {
        var init = false;
        var kmlDoc;
        try {
            kmlDoc = $.parseXML(kml);
            this.$kml = $(kmlDoc);
            $('Placemark', this.$kml).each(function (i) {
                $(this).attr("status", "0");
                $(this).attr("id", i);
                $(this).append("<Point_b><coordinates></coordinates></Point_b>");
                $(this).append("<vorname></vorname>");
                $(this).append("<nachname></nachname>");
                $(this).append("<start></start>");
                $(this).append("<end></end>");
                $(this).append("<items></items>");
            });
            console.log("KML erfolgreich geladen");
            init = true;
        } catch (err) {
            console.log("Fehler beim Laden von KML" + err);
            init = false;
        }
        return init;
    },
    initLoadedKml: function (kml) {
        var init = false;
        var kmlDoc; 
            try{
                kmlDoc = $.parseXML(kml);
                this.$kml = $(kmlDoc);
                console.log("KML erfolgreich geladen");
                init =true;
            }catch (err) { 
                    console.log("Fehler beim Laden von KML" +err);
                    init =false;
            }
            return init;
            },

    initGerueche: function (gerueche) {
        var init = false;
        var geruecheDoc;
        try {
            geruecheDoc = $.parseXML(gerueche);
            this.$gerueche = $(geruecheDoc);
            console.log("Gerueche xml erfolgreich geladen");
            init = true;
        } catch (err) {
            console.log("Fehler beim Laden von Gerüche xml" + err);
            init =false;
    }
        //geruchseindruecke.split(";").forEach(function (item) {
        //this.eindruecke.push(item);
        //});
        return init;
    },
    
    getBegehung:function()
    {
        this.begehung.kml = this.getXmlAsString($(this.$kml)[0]);
        this.begehung.gerueche = this.getXmlAsString($(this.$gerueche)[0]);
        return this.begehung;
    },

    getXmlAsString:function(xmlDom){
      return (typeof XMLSerializer!=="undefined") ? 
        (new window.XMLSerializer()).serializeToString(xmlDom) : 
        xmlDom.xml;
    },

    isFinishedBegehung: function () {
        var isFinished = true;
        $(this.$kml).find("Placemark").each(function (index, element) {
            if ($(element).attr("status") == 0) isFinished = false;
        });
        return isFinished;
    }

};

