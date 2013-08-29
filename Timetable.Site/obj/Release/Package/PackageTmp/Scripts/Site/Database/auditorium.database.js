var dModel;
var auditoriumStore;
var Editing;
var grid;

function showError(msg) {
    $.jGrowl("<b><span style='color: #F20;'>" + msg + "</span></b>", { header: "<b><span style='color: #F20;'>Ошибка</span></b>", position: "center" });
}

function auditoriumDbViewModel() {
	var self = this;

	self.selectBuildings = ko.observableArray([]);
	self.selectCurrentBuilding = ko.observable();
	
	self.selectAuditoriumTypes = ko.observableArray([]);
	self.selectCurrentAuditoriumType = ko.observable();

	self.addNumber = ko.observable();
	self.addName = ko.observable();
	self.addCapacity = ko.observable();
	self.addInfo = ko.observable();

	self.addValidateModel = ko.observable(false);
	self.numberValidateModel = ko.observable(false);
	self.capacityValidateModel = ko.observable(false);
	self.numberErrorMsg = ko.observable("Это поле необходимо заполнить");
	self.capacityErrorMsg = ko.observable("Это поле необходимо заполнить");
	self.addBlock = ko.observable(false);

	self.addValidateModel.subscribe(function (newValue) {
	    if (newValue == true) {
	        $("#addButton").removeClass("disabled");
	        $("#addButton").addClass("enabled");
	        self.addBlock(false);
	    } else {
	        $("#addButton").removeClass("enabled");
	        $("#addButton").addClass("disabled");
	        self.addBlock(true);
	    }
	});

	self.numberValidateModel.subscribe(function (newValue) {
	    if (newValue == true) {
	        if (self.capacityValidateModel() == true)
	            self.addValidateModel(true);
	        $("#numberError").addClass("hide");
	    } else {
	        $("#numberError").removeClass("hide");
	        self.addValidateModel(false);
	    }
	});

	self.capacityValidateModel.subscribe(function (newValue) {
	    if (newValue == true) {
	        if (self.numberValidateModel() == true)
	            self.addValidateModel(true);
	        $("#capacityError").addClass("hide");
	    } else {
	        $("#capacityError").removeClass("hide");
	        self.addValidateModel(false);
	    }
	});


	self.validateAddNumber = function (number) {
	    var ok = false;
	    if (number !== undefined) {
	        if (number !== "") {
	            ok = true;
	        }
	    }
	    if (ok) {
	        self.numberValidateModel(true);
	    } else {
	        self.numberErrorMsg("Недопустимое значение");
	        self.numberValidateModel(false);
	    }
	}

	self.validateAddCapacity = function (capacity) {
	    var ok = false;
	    if (capacity !== undefined) {
	        if (capacity !== "") {
	            if (capacity > 0) {
	                if (capacity < 200) {
	                    ok = true;
	                }
	            }
	        }
	    }
	    if (ok) {
	        self.capacityValidateModel(true);
	    } else {
	        self.capacityErrorMsg("Недопустимое значение");
	        self.capacityValidateModel(false);
	    }
	}

	self.addNumber.subscribe(function (newValue) {
	    self.validateAddNumber(newValue);
	});

	self.addCapacity.subscribe(function (newValue) {
	    self.validateAddCapacity(newValue);
	});

	self.init = function () {
	    $('#addmodal').modal({
	        keyboard: true,
	        show: false
	    });

	    /*$("#addmodal").draggable({
	        handle: ".modal-header"
	    });*/

	    Ext.define('Auditorium', {
	        extend: 'Ext.data.Model',
	        fields: [
            { name: 'Id', type: 'int' },
            { name: 'Number', type: 'string' },
            { name: 'Capacity', type: 'int' },
            { name: 'Name', type: 'string' },
            { name: 'Info', type: 'string' }
	        ],
	        validations: [{
	            type: 'length',
	            field: 'Number',
	            min: 1
	        }]
	    });

	    auditoriumStore = Ext.create('Ext.data.Store', {
	        model: 'Auditorium',
	        proxy: {
	            type: 'ajax',
	            url: '/api/v1.0/Auditorium/GetByBuilding',
	            reader: {
	                type: 'json',
	                root: 'auditoriums'
	            }
	        },
	        autoLoad: true
	    });

	    Editing = Ext.create('Ext.grid.plugin.CellEditing');

	    grid = new Ext.grid.Panel({
	        plugins: [
            Editing
	        ],
	        stateful: true,
	        stateId: 'stateGrid',
	        renderTo: 'grid11',
	        store: auditoriumStore,
	        autoScroll: true,
	        layout: 'fit',
	        width: 'auto',
	        height: 500,
	        title: 'Аудитории',
	        columns: [

            {
                text: 'Номер',
                width: 100,
                sortable: true,
                dataIndex: 'Number',
                field: {
                    xtype: 'textfield'
                }
            },
            {
                text: 'Название',
                width: 100,
                sortable: true,
                dataIndex: 'Name',
                field: {
                    xtype: 'textfield'
                }
            },
            {
                text: 'Вместимость',
                width: 100,
                sortable: true,
                dataIndex: 'Capacity',
                field: {
                    xtype: 'textfield'
                }
            },
            {
                text: 'Информация',
                width: 100,
                sortable: true,
                dataIndex: 'Info',
                field: {
                    xtype: 'textfield'
                }
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                items: [
                {
                    icon: '/Content/resources/ext-theme-classic/images/dd/drop-no.gif',
                    tooltip: 'Удалить',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        self.delAuditorium(rec);         
                    }
                }]
            }
	        ],
	        bbar: new Ext.PagingToolbar({
	            store: auditoriumStore,
	            displayInfo: true,
	            displayMsg: 'Показано  {0} - {1} из {2}'
	        })
	    });

	    Ext.create('Ext.container.Viewport', {
	        width: 'auto',
	        height: 600,
	        layout: 'border',
	        defaults: {
	            collapsible: true,
	            split: true,
	        },
	        items: [
                {
                    title: 'Меню',
                    region: 'west',
                    margins: '5 0 0 0',
                    cmargins: '5 5 0 0',
                    width: 200,
                    minSize: 100,
                    maxSize: 250,
                    preventHeader: true,
                    hideCollapseTool: true,
                    contentEl: 'bar11'
                },
                 {
                     region: 'north',
                     autoScroll: false,
                     height: 40,
                     preventHeader: true,
                     hideCollapseTool: true,
                     contentEl: 'header'
                 }, {
                    collapsible: false,
                    layout: 'fit',
                    region: 'center',
                    margins: '5 0 0 0',
                    items: grid
                }],


	        renderTo: 'grid11'

	    });
	}

	self.addButtonShowModal = function () {
	    $('#addmodal').modal('show');
	}

	self.buttonModalClose = function () {
	    $('#addmodal').modal('hide');
	}

	self.addButton = function () {
	   

	    if (self.addBlock())
	        return;

	    if (self.addNumber() == "") {
	        showError("Не указан номер аудитории");
	        return;
	    }

	    var iCapacity = parseInt(self.addCapacity());
	    if (iCapacity <= 0) {
	        showError("Не указана вместимость аудитории");
	        return;
	    }
	    if (iCapacity >=  300) {
	        showError("Не указана вместимость аудитории");
	        return;
	    }

	    $('#addmodal').modal('hide');

	    if (self.selectCurrentBuilding() !== undefined && self.selectCurrentAuditoriumType() !== undefined) {
	        auditoriumStore.insert(0, new Auditorium({
	            Id: 1,
	            Number: self.addNumber(),
	            Capacity: self.addCapacity(),
	            Name: self.addName(),
	            Info: self.addInfo()
	        }));
	        Editing.startEdit(0, 0);

	        self.addAuditorium(self.selectCurrentBuilding().Id,
				self.selectCurrentAuditoriumType().Id,
				self.addNumber(),
				self.addCapacity(),
				self.addName(),
				self.addInfo());
	    }
	}

	self.delButton = function () {
	    var selection = grid.getView().getSelectionModel().getSelection()[0];
	    if (selection) {
	        self.delAuditorium(selection);
	    } else {
	        showError("Не выбрана строка в таблице");
	    }
	}

	self.addAuditorium = function (buildingId, auditoriumTypeId, number, capacity, name, info) {
		dModel.sendData({
			address: "auditorium/add",
			params: {
				'BuildingId': buildingId,
				'AuditoriumTypeId': auditoriumTypeId,
				'Number': number,
				'Capacity': capacity,
				'Name': name,
				'Info': info
			},
			onsuccess: function () {
			    //insert

			},
		    onerror: function(){

		    }
		});
	}

	self.delAuditorium = function (selection) {
		dModel.sendData({
			address: "auditorium/delete",
			params: {
			    'Id': selection.data.Id
			},
			onsuccess: function () {
			    grid.store.remove(selection);
			},
			onerror: function () {

			}
		});
	}

	self.loadBuildings = function () {
		dModel.loadData({
			address: "building/getall",
			obj: self.selectBuildings,
			onsuccess: function () {
			}
		});
	}

	self.loadAuditoriumTypes = function () {
		dModel.loadData({
			address: "auditoriumtype/getall",
			obj: self.selectAuditoriumTypes,
			onsuccess: function () {
			}
		});
	}

	self.datainit = function () {
		self.loadBuildings();
	}

	self.selectCurrentBuilding.subscribe(function (newValue) {
		if (newValue !== undefined) {
			self.loadAuditoriumTypes();
		}
	});

	self.selectCurrentAuditoriumType.subscribe(function (newValue) {
		if (newValue !== undefined) {
			if(self.selectCurrentBuilding() !== undefined){
			    auditoriumStore.load({
			        params: {
			            buildingId: self.selectCurrentBuilding().Id,
			            auditoriumTypeId: self.selectCurrentAuditoriumType().Id
			        }
			    });
			}
		}
	});


}

$(function () {
	auditoriumDbViewModel = new auditoriumDbViewModel();
	dModel = new dataModel();

	auditoriumDbViewModel.init();
	auditoriumDbViewModel.datainit();

	ko.applyBindings(auditoriumDbViewModel);
});