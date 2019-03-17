import * as CommonHelpers from "./CommonHelpers";
import * as DialogService from "./DialogService";
import * as FormHelpers from "./FormHelpers";

import {
    HttpService
} from "./HttpService";
import {
    ProgressBar
} from "./ProgressBar";
import {
    Toaster
} from "./Toaster";

require('./listeners');

global.HttpService = HttpService();
global.Toaster = Toaster();
global.DialogService = DialogService;
global.FormHelpers = FormHelpers;
global.CommonHelpers = CommonHelpers;
global.ProgressBar = ProgressBar;