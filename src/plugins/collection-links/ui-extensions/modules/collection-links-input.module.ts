import {
  NgModule,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { notify } from "@vendure/ui-devkit";
import { combineLatest, Observable, of, Subject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  mergeMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { FormControl } from "@angular/forms";
import {
  SharedModule,
  CustomFieldControl,
  CustomFieldConfigType,
  registerCustomFieldComponent,
  DataService,
} from "@vendure/admin-ui/core";
import { ActivatedRoute } from "@angular/router";
import { ID, LanguageCode } from "@vendure/core";
import { parse } from "graphql";

@Component({
  template: `
    <input type="checkbox" [formControl]="formControl" />
    <div *ngIf="formControl.value">
      <table class="table">
        <thead>
          <tr>
            <th>Typ</th>
            <th>Name</th>
            <th>URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let link of links; let i = index">
            <td>
              <select (input)="onTypeChange(i, $event.target.value)">
                <option value="PDF" [selected]="link.type == 'PDF'">PDF</option>
                <option value="VIDEO" [selected]="link.type == 'VIDEO'"
                  >Video</option
                >
                <option value="LINK" [selected]="link.type == 'LINK'"
                  >Link</option
                >
              </select>
            </td>
            <td>
              <input
                type="text"
                value="{{ link.name }}"
                (input)="onNameChange(i, $event.target.value)"
              />
            </td>
            <td>
              <input
                type="text"
                value="{{ link.url }}"
                (input)="onUrlChange(i, $event.target.value)"
              />
            </td>
            <td>
              <button class="btn btn-danger" (click)="removeEntry(i)">x</button>
            </td>
          </tr>
          <tr>
            <td><input style="visibility:hidden;" /></td>
            <td><input style="visibility:hidden;" /></td>
            <td>
              <button class="btn btn-secondary" (click)="newEntry()">
                New entry
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <button class="btn btn-primary" (click)="saveCollectionLinks()">
        Save
      </button>
      <br /><br />
    </div>
  `,
})
export class CollectionLinksControl
  implements CustomFieldControl, OnInit, OnDestroy {
  customFieldConfig: CustomFieldConfigType;
  formControl: FormControl;

  collectionId$: Observable<ID | null>;
  languageCode$: Observable<LanguageCode>;

  links: { id?: ID; type: string; name: string; url: string }[];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.links = [];
  }

  ngOnInit() {
    this.languageCode$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get("lang")),
      switchMap((lang) => {
        if (lang) {
          return of(lang as LanguageCode);
        } else {
          return this.dataService.settings
            .getActiveChannel()
            .mapSingle((data) => data.activeChannel.defaultLanguageCode);
        }
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.collectionId$ = this.route.paramMap.pipe(
      map((paramMap) => paramMap.get("id")),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.collectionId$.subscribe((collectionId) => {
      if (collectionId) {
        this.dataService
          .query<
            {
              collection: {
                links: { id: ID; type: string; name: string; url: string }[];
              };
            },
            { id: ID }
          >(
            parse(
              `query CollectionLinks($id: ID!){
            collection(id: $id){
              id
              links{
                id
                type
                name
                url
              }
            }
          }`
            ),
            { id: collectionId }
          )
          .single$.toPromise()
          .then((response) => {
            this.links = response.collection.links;
            this.cdr.detectChanges();
          })
          .catch((e) => {
            notify({
              message: "Links couldn't be fetched. Check the console.",
              type: "error",
            });
            console.error(e);
          });
      }
    });
  }

  ngOnDestroy() {}

  onTypeChange(index: number, value: string) {
    if (value) {
      this.links[index].type = value;
    }
  }
  onNameChange(index: number, value: string) {
    this.links[index].name = value;
  }
  onUrlChange(index: number, value: string) {
    this.links[index].url = value;
  }

  removeEntry(index: number) {
    const removedLink = this.links.splice(index, 1);
    if (!removedLink[0].id) {
      console.log(removedLink[0], "doesn't contain an id!");
      notify({
        message: "Collection link couldn't be removed. Check the console.",
        type: "error",
      });
      return;
    }
    this.dataService
      .mutate<
        {
          deleteCollectionLink: boolean;
        },
        {
          id: ID;
        }
      >(
        parse(
          `mutation DeleteCollectionLink($id: ID!) {
              deleteCollectionLink(id: $id)
            }`
        ),
        {
          id: removedLink[0].id,
        }
      )
      .toPromise()
      .catch((e) => {
        notify({
          message: "Collection link couldn't be removed. Check the console.",
          type: "error",
        });
        console.error(e);
        this.links.push(removedLink[0]);
        this.cdr.detectChanges();
      });
  }

  newEntry() {
    this.links.push({ type: "PDF", name: "", url: "" });
  }

  saveCollectionLinks() {
    combineLatest(this.collectionId$, this.languageCode$)
      .pipe(take(1))
      .subscribe(([collectionId, languageCode]) => {
        if (collectionId) {
          const toUpdate: {
            id: ID;
            type: string;
            name: string;
            url: string;
          }[] = [];
          const toCreate: { type: string; name: string; url: string }[] = [];

          this.links.forEach((l) => {
            const id = l.id;

            if (id) {
              toUpdate.push({ id, type: l.type, name: l.name, url: l.url });
            } else {
              toCreate.push(l);
            }
          });

          if (toUpdate.length > 0) {
            this.dataService
              .mutate<
                {
                  updateCollectionLinks: boolean;
                },
                {
                  input: {
                    id: ID;
                    collectionId: ID;
                    type: string;
                    translations: { name: string; url: string }[];
                  }[];
                }
              >(
                parse(
                  `mutation UpdateCollectionLinks($input: [UpdateCollectionLinkInput!]!) {
                    updateCollectionLinks(input: $input)
                  }`
                ),
                {
                  input: toUpdate.map((l) => ({
                    id: l.id,
                    collectionId,
                    type: l.type,
                    translations: [{ languageCode, name: l.name, url: l.url }],
                  })),
                }
              )
              .toPromise()
              .then(() =>
                notify({
                  message: "Product links updated successfully",
                  type: "success",
                })
              )
              .catch((e: any) => {
                notify({
                  message:
                    "Product links couldn't be updated. Check the console.",
                  type: "error",
                });
                console.error(e);
              });
          }

          if (toCreate.length > 0) {
            this.dataService
              .mutate<
                {
                  createCollectionLinks: boolean;
                },
                {
                  input: {
                    collectionId: ID;
                    type: string;
                    translations: { name: string; url: string }[];
                  }[];
                }
              >(
                parse(
                  `mutation CreateCollectionLinks($input: [CreateCollectionLinkInput!]!) {
                    createCollectionLinks(input: $input)
                  }`
                ),
                {
                  input: toCreate.map((l) => ({
                    collectionId,
                    type: l.type,
                    translations: [{ languageCode, name: l.name, url: l.url }],
                  })),
                }
              )
              .toPromise()
              .then(() =>
                notify({
                  message: "Product links created successfully",
                  type: "success",
                })
              )
              .catch((e) => {
                notify({
                  message:
                    "Product links couldn't be created. Check the console.",
                  type: "error",
                });
                console.error(e);
              });
          }
        }
      });
  }
}

@NgModule({
  imports: [SharedModule],
  declarations: [CollectionLinksControl],
  providers: [
    registerCustomFieldComponent(
      "Collection",
      "hasLinks",
      CollectionLinksControl
    ),
  ],
})
export class CollectionLinkInputModule {}
