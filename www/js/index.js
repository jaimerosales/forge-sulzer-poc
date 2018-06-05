/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Jaime Rosales 2016 - Forge Developer Partner Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

var viewer;
var viewer2;
var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken,
    documentId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cGFya2VyLXBvYy9Gcm9udCUyMExvYWRlci5pYW0uemlw'

}

var data1stview = {
    "Items": [{
        "markupId": 1,
        "x": 1100.37674052735037833,
        "y": -95.0107518497603,
        "z": -402.620531023927,
        "type": "BIMIQ_Warning"
    }, {
        "markupId": 2,
        "x": 201.95253612923999,
        "y": 1843.3121015846427,
        "z": 1050.1132431164415,
        "type": "BIMIQ_Warning",
    }, {
        "markupId": 3,
        "x": 403.0419596808389,
        "y": -1947.9918734596254,
        "z": 1228.7535747854722,
        "type": "BIMIQ_Warning",
    }]
} ;

Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(options.documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
});


/**
 * Autodesk.Viewing.Document.load() success callback.
 * Proceeds with model initialization.
 */
function onDocumentLoadSuccess(doc) {

    // A document contains references to 3D and 2D viewables.
    var viewable = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
        'type': 'geometry'
    }, true);
    if (viewable.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }

    // Choose any of the available viewable
    var initialViewable = viewable[0];
    var svfUrl = doc.getViewablePath(initialViewable);


    var modelOptions = {
        sharedPropertyDbPath: doc.getPropertyDbPath()
    };

    var viewerDiv = document.getElementById('viewerDiv');


    window.addEventListener("onPointClick", function(e){

        // document.getElementById("viewerDivs").classList.add("col-md-8")
        // document.getElementById("threedviewer").classList.add("viewer1")

        // viewer.resize();

        if (e.detail === 1){
            document.getElementById("myIframe").src = './parker-html/Engine/PowerShift%20(Hydraulic)%2010-Bolt%20Power%20Take-Off%20(PTO)%20-%20280%20Series%20_%20Parker%20NA.htm'
            viewer.isolate(682)
            viewer.fitToView();
            loadViewer2("urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cGFya2VyLXBvYy9lbmdpbmUub2JqLnppcA")
        }

        if (e.detail === 2){
            document.getElementById("myIframe").src = './parker-html/Front/PowerShift%20(Hydraulic)%2010-Bolt%20Power%20Take-Off%20(PTO)%20-%20890%20Series%20_%20Parker%20NA.htm';
            viewer.isolate(4598)
            viewer.fitToView();
            loadViewer2("urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cGFya2VyLXBvYy9mcm9udC5vYmouemlw")
        }

        if (e.detail === 3){
            document.getElementById("myIframe").src = './parker-html/Back/Aluminum%20Pumps%20–%20PGP505%20Series%20_%20Parker%20NA.htm';
            viewer.isolate([3531, 3533])
            viewer.fitToView();
            loadViewer2("urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cGFya2VyLXBvYy9iYWNrLm9iai56aXA")
        }

    }, false);


    //////////////////Viewer with Autodesk Toolbar///////////////////////
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
    //////////////////////////////////////////////////////////////////////

    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);

    //viewer.setBackgroundColor(35, 31, 32, 35, 31, 32);

}



function loadViewer2(urn2) {

    Autodesk.Viewing.Document.load(urn2, function SecondViewerSuccess(doc2)
    {

        var viewable = Autodesk.Viewing.Document.getSubItemsWithProperties(doc2.getRootItem(), {
            'type': 'geometry'
        }, true);
        if (viewable.length === 0) {
            console.error('Document contains no viewables.');
            return;
        }

        // Choose any of the available viewable
        var initialViewable = viewable[0];
        var svfUrl = doc2.getViewablePath(initialViewable);


        var modelOptions = {
            sharedPropertyDbPath: doc2.getPropertyDbPath()
        };

        var viewerDiv2 = document.getElementById('viewerDiv2');
        /////////////////////// Headless Viewer /////////////////////////////
        viewer2 = new Autodesk.Viewing.Viewer3D(viewerDiv2);
        //////////////////////////////////////////////////////////////////////
        viewer2.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError)
        viewer2.fitToView();
    },onDocumentLoadFailure);
}


/**
 * Autodesk.Viewing.Document.load() failure callback.
 */
function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

/**
 * viewer.loadModel() success callback.
 * Invoked after the model's SVF has been initially loaded.
 * It may trigger before any geometry has been downloaded and displayed on-screen.
 */
function onLoadModelSuccess(model) {
    viewer.loadExtension("markup3d");
    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoadedHandler);

    console.log('onLoadModelSuccess()!');
    console.log('Validate model loaded: ' + (viewer.model === model));
    console.log(model);
}

/**
 * viewer.loadModel() failure callback.
 * Invoked when there's an error fetching the SVF file.
 */
function onLoadModelError(viewerErrorCode) {
    console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
}

/**
 * Geometry Loader Listener
 */
function onGeometryLoadedHandler(event) {
   // console.log("Geo loaded", data);
    window.dispatchEvent(new CustomEvent('newData', {'detail': data1stview}));

    viewer.removeEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        onGeometryLoadedHandler);

}
