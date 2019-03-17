global.DataTableCard = DataTableCard;
global.DataTable = DataTable;
global.DefaultValue = DefaultValue;

export function DataTableCard(card, config) {

    let _tableElement, _dataTable, _toolbar, _searchWrapper, _search, _optionsWrapper, _progressBar;

    const dtCard = {
        get element() {
            return card;
        },
        get dataTable() {
            return _dataTable;
        },
        get progressBar() {
            return _progressBar;
        }
    };

    Initialize();

    return dtCard;

    function Initialize() {
        _tableElement = card.querySelector('table');
        if (!_tableElement) throw 'A "table" element is required.';

        _toolbar = card.querySelector('.toolbar');

        if (_toolbar) {
            _searchWrapper = _toolbar.querySelector('.search');
            _optionsWrapper = _toolbar.querySelector('.options');
            _progressBar = card.querySelector('.progress');
            if (!_progressBar) {
                _progressBar = ProgressBar();
                _toolbar.insertAdjacentElement('beforeend', _progressBar.element);
            } else _progressBar = ProgressBar(_progressBar);
        }

        _dataTable = DataTable(_tableElement, config);

        _search = document.querySelector('.dataTables_filter input');
        _search.remove();
        if (_searchWrapper) _searchWrapper.appendChild(_search);

        if (_optionsWrapper) {
            new $.fn.dataTable.Buttons(_dataTable, {
                buttons: [{
                    extend: 'excel',
                    text: '<i class="fas fa-download"></i>',
                    className: "icon"
                }]
            });

            _dataTable.buttons(0, null).container().appendTo(_optionsWrapper);
            const exportBtn = _optionsWrapper.querySelector('.buttons-excel');
            exportBtn.classList.add('t-top');
            exportBtn.classList.add('t-xs');
            exportBtn.setAttribute('tooltip', 'Export Data');
        }

        _tableElement.style.display = '';

        let searchTerm = HttpService.getQueryParam('Search');
        console.log(searchTerm);
        if (searchTerm) _dataTable.search(searchTerm).draw();
    }
}

export function DataTable(element, config) {
    if (element.tagName != 'TABLE') throw 'DataTable element must be a "table" element.';

    let settings = {
        ajax: config.ajax || undefined,
        dom: config.dom || 'f<"table"t><"footer" <"spacer">lip>',
        columns: config.columns || [],
        select: config.select || undefined,
        columnDefs: config.columnDefs || [],
        pagingType: config.pagingType || "simple",
        "order": config.order || [],
        autoWidth: config.autoWidth || false,
        language: {
            lengthMenu: "Items per page: _MENU_",
            info: "_START_ - _END_ of _TOTAL_ Results",
            infoEmpty: "0 of 0 Results",
            infoFiltered: "(filtered from _MAX_)",
            zeroRecords: "No matches found",
            search: "",
            searchPlaceholder: 'Search...',
            paginate: {
                previous: '<',
                next: '>'
            },
            aria: {
                paginate: {
                    previous: 'Previous',
                    next: 'Next'
                }
            }
        }
    };

    if (config.language) {
        if (config.language.lengthMenu) settings.language.lengthMenu = config.language.lengthMenu;
        if (config.language.info) settings.language.info = config.language.info;
        if (config.language.infoEmpty) settings.language.infoEmpty = config.language.infoEmpty;
        if (config.language.infoFiltered) settings.language.infoFiltered = config.language.infoFiltered;
        if (config.language.zeroRecords) settings.language.zeroRecords = config.language.zeroRecords;
        if (config.language.searchPlaceholder) settings.language.searchPlaceholder = config.language.searchPlaceholder;
        if (config.language.paginate) {
            if (config.language.paginate.previous) settings.language.paginate.previous = config.language.paginate.previous;
            if (config.language.paginate.next) settings.language.paginate.next = config.language.paginate.next;
        }
        if (config.language.aria) {
            if (config.language.aria.paginate.previous) settings.language.aria.paginate.previous = config.language.aria.paginate.previous;
            if (config.language.aria.paginate.next) settings.language.aria.paginate.next = config.language.aria.paginate.next;
        }
    }

    if (config.initComplete && CommonHelpers.isFunction(config.initComplete)) settings.initComplete = config.initComplete;
    if (config.createdRow && CommonHelpers.isFunction(config.createdRow)) settings.initComplete = config.initComplete;

    for (let i = 0; i > settings.columns.length; i++)
        if (!settings.columns[i].render) settings.columns[i].render = DefaultValue;

    return $(element).DataTable(settings);
}

export function DefaultValue(data) {
    return (data != '') ? data : '--';
}