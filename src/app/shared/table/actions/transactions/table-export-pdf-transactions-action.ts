import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CentralServerService } from '../../../../services/central-server.service';
import { DialogService } from '../../../../services/dialog.service';
import { MessageService } from '../../../../services/message.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { FilterParams } from '../../../../types/GlobalType';
import { TableActionDef } from '../../../../types/Table';
import { Transaction, TransactionButtonAction } from '../../../../types/Transaction';
import { TableExportPdf } from '../table-export-pdf-action';

export interface TableExportPdfTransactionsActionDef extends TableActionDef {
  action: (filters: FilterParams, dialogService: DialogService, translateService: TranslateService,
    messageService: MessageService, centralServerService: CentralServerService, spinnerService: SpinnerService,
    router: Router, clearSelectedRows: () => void, refresh?: () => Observable<void>) => void;
}

export class TableExportPdfTransactionsAction extends TableExportPdf {
  public getActionDef(): TableExportPdfTransactionsActionDef {
    return {
      ...super.getActionDef(),
      id: TransactionButtonAction.EXPORT_PDF_TRANSACTIONS,
      action: this.exportPdfTransactions,
    };
  }

  private exportPdfTransactions(filters: FilterParams, dialogService: DialogService, translateService: TranslateService,
    messageService: MessageService, centralServerService: CentralServerService, spinnerService: SpinnerService,
    router: Router, clearSelectedRows: () => void, refresh?: () => Observable<void>) {

    super.exportPdf(filters, 'exported-transactions.pdf',
    'transactions.dialog.export.title', 'transactions.dialog.export.confirm',
    'transactions.dialog.export.error',
      centralServerService.exportTransactionsPdf.bind(centralServerService),
      dialogService, translateService, messageService,
      centralServerService, spinnerService, router);
  }
}
