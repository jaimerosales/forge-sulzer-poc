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
    documentId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3VsemVyLXBvYy1hc3NlbWJseS9FWFBOLUFTTS1FNTIwJTIwdyUyMFJvdG9yLmlhbS56aXA'

}

var data1stview = {
    "Items": [{
        "markupId": 0,
        "x": -10007.7299498156492916,
        "y": 2.9263527002787177,
        "z": -1.0915325371984984,
        icon: 0
    }, {
        "markupId": 1,
        "x": -7.7299498156492916,
        "y": 2.9263527002787177,
        "z": -1.0915325371984984,
        "type": "RFI"
    }, {
        "markupId": 2,
        "x": -11.132244761986222,
        "y": 2.9263527002787177,
        "z": -1.0915325371984984,
        "type": "RFI"
    }, {
        "markupId": 3,
        "x": -15.132244761986222,
        "y": 2.9263527002787177,
        "z": -1.0915325371984984,
        "type": "RFI"
    }, {
        "markupId": 4,
        "x": -19.132244761986222,
        "y": 2.9263527002787177,
        "z": -1.0915325371984984,
        "type": "RFI"
    }, {
        "markupId": 5,
        "x": -23.132244761986222,
        "y": 2.9263527002787177,
        "z": -1.0915325371984984,
        "type": "RFI"
    }, {
        "markupId": 6,
        "x": -26.28284723829211,
        "y": 1.4598347969165424,
        "z": -1.0915325371984984,
        "type": "BIMIQ_Warning"
    }, {
        "markupId": 7,
        "x": -3.28284723829211,
        "y": 1.4598347969165424,
        "z": -1.0915325371984984,
        "type": "BIMIQ_Warning"
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

        if (e.detail === 7){
            document.getElementById("myIframe").src = './sulzer-pdf/BUSH-MFG-LP.pdf';
            viewer.isolate(569)
            viewer.fitToView();
            
        }
        
        if (e.detail === 8){
            document.getElementById("myIframe").src = './sulzer-pdf/TBLT-MFG-00.pdf';
            viewer.isolate(555)
            viewer.fitToView();
        } 
        
        if (e.detail == 6 || e.detail == 2 || e.detail == 3 || e.detail == 4 || e.detail == 5){
            document.getElementById("myIframe").src = './sulzer-pdf/AMS 5732H_A286 Spec.pdf';
            viewer.isolate([559, 561, 563, 565, 567])
            viewer.fitToView();
        }

    }, false);


    //////////////////Viewer with Autodesk Toolbar///////////////////////
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
    //////////////////////////////////////////////////////////////////////

    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
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
