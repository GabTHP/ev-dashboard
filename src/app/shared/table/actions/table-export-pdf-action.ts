import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';

import { CentralServerService } from '../../../services/central-server.service';
import { DialogService } from '../../../services/dialog.service';
import { MessageService } from '../../../services/message.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ButtonAction, ButtonActionColor, FilterParams } from '../../../types/GlobalType';
import { TableActionDef, TableData } from '../../../types/Table';
import { ActionsResponse } from '../../../types/DataResult';
import { Utils } from '../../../utils/Utils';
import { TableAction } from './table-action';

export class TableExportPdf implements TableAction {
  private action: TableActionDef = {
    id: ButtonAction.EXPORT_PDF,
    type: 'button',
    icon: 'cloud_download',
    color: ButtonActionColor.PRIMARY,
    name: 'general.generate_expense',
    tooltip: 'general.tooltips.generate_expense',
    action: this.exportPdf,
  };

  // Return an action
  public getActionDef(): TableActionDef {
    return this.action;
  }

  protected exportPdf(filters: FilterParams, exportedFilename: string, messageTitle: string, messageConfirm: string,
    messageError: string, exportData:  (filters: FilterParams) => Observable<Blob>,
    dialogService: DialogService, translateService: TranslateService, messageService: MessageService,
    centralServerService: CentralServerService, spinnerService: SpinnerService, router: Router) {
    dialogService.createAndShowYesNoDialog(
      translateService.instant(messageTitle),
      translateService.instant(messageConfirm),
    ).subscribe((response) => {
      if (response === ButtonAction.YES) {
        spinnerService.show();
        exportData(filters).subscribe({
          next: (result) => {
            spinnerService.hide();
            FileSaver.saveAs(result, exportedFilename);
          },
          error: (error) => {
            spinnerService.hide();
            Utils.handleHttpError(error, router, messageService,
              centralServerService, translateService.instant(messageError));
          }
        });
      }
    });
  }
}
