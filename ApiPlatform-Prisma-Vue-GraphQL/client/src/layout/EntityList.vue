<template>
  <v-data-table
    :headers="headers"
    :items="getItems"
    class="elevation-1"
    :server-items-length="getItemsCount"
    :options.sync="options"
    :loading="loading"
    :footer-props="footerProps"
    loading-text="Loading..."
    :hide-default-footer="true"
    disable-filtering
  >
    <template v-slot:top>
      <v-toolbar flat>
        <div class="toolbar__content">
          <v-toolbar-title v-if="displayTitle">{{ title }}</v-toolbar-title>

          <router-link v-if="pathToAdd" :to="pathToAdd">
            <v-btn color="primary" elevation="2">{{ $t("form.add") }}</v-btn>
          </router-link>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title>
                {{ $t("form.deleteConfirm") }}
              </v-card-title>
              <v-card-actions class="justify-space-between">
                <v-btn color="dark" text @click="closeDelete">{{ $t("form.cancel") }}</v-btn>
                <v-btn color="primary" @click="deleteConfirm">{{ $t("form.validate") }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-toolbar>
    </template>

    <template v-if="pathToEdit || deleteEntityAction || pathToShow" v-slot:item.actions="{ item }">
      <v-icon v-if="pathToShow" small class="mr-2" @click="showItem(item)">mdi-eye</v-icon>
      <v-icon v-if="pathToEdit" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon v-if="deleteEntityAction" small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="getColor(item.status)">{{ $t(item.status) }}
      </v-chip>
    </template>

    <template v-slot:item.owner="{ item }">
      {{ `${item.owner.email} - ${item.owner.lastname} ${item.owner.firstname} - ${item.owner.phone}` }}
    </template>

    <template v-slot:footer>
      <div class="custom-footer">
        <div class="custom-pagination">Page {{ pagination.page }}</div>
        <div class="custom-icons-before">
          <button
            type="button"
            @click="previousPage"
            class="v-btn"
            aria-label="Previous page"
          >
            <span class="v-btn__content">
              <i
                aria-hidden="true"
                class="v-icon notranslate mdi mdi-chevron-left theme--light"
              ></i>
            </span>
          </button>
        </div>
        <div class="custom-icons-after">
          <button
            type="button"
            @click="nextPage"
            class="v-btn"
            aria-label="Next page"
          >
            <span class="v-btn__content">
              <i
                aria-hidden="true"
                class="v-icon notranslate mdi mdi-chevron-right theme--light"
              ></i>
            </span>
          </button>
        </div>
      </div>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary"> Aucune donnée</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { getFilePerEndpoint } from "@/utils";
import { mapGetters, mapMutations } from "vuex";
import { formatDate } from "@/utils";

export default {
  name: "EntityList",
  props: {
    propsItems: {
      type: Array,
      required: false,
    },
    propsTotalItems: {
      type: Number,
      required: false,
    },
    headers: Array,
    title: String,
    displayTitle: {
      type: Boolean,
      default: true,
    },
    keyObject: {
      type: String,
      default: "",
    },
    keyObjectToDelete: {
      type: String,
      default: "",
    },
    pathToAdd: Object,
    pathToEdit: Object,
    pathToShow: Object,
    getEntityAction: Object,
    deleteEntityAction: Object,
  },
  data: () => ({
    search: "",
    loading: false,
    dialogDelete: false,
    itemToDelete: null,
    items: [],
    options: {
      itemsPerPage: 30,
      rowsPerPage: 30,
    },
    footerProps: {
      "items-per-page-options": [],
      "items-per-page-text": null,
      "disable-items-per-page": true,
    },
    totalItems: 0,
    pagination: {
      itemsPerPage: 30,
      page: 1,
      pageStart: 0,
    },
  }),
  watch: {
    dialogDelete (val) {
      val || this.closeDelete();
    },
  },
  computed: {
    ...mapGetters(["getEndpointLabel"]),
    getItems () {
      let items = [];
      if (this.$props.propsItems) {
        items = this.$props.propsItems;
      } else {
        items = this.$data.items;
      }
      return items;
    },
    getItemsCount () {
      let count = 0;
      if (this.$props.propsItems) {
        count = this.$props.propsItems.length;
      } else {
        count = this.$data.totalItems;
      }
      return count;
    },
  }
  ,
  created () {
    this.initialize();
  }
  ,
  methods: {
    ...mapMutations(["addFlashMessage"]),
    initialize () {
      if (!this.$props.propsItems) {
        this.$data.loading = true;
        this.fetchApi().then(() => {
          this.$data.loading = false;
        });
      }
    },
    getColor (value) {
      let color = "";
      switch (value) {
        case "APPROVED":
        case "VERIFIED":
          color = "success";
          break;
        case "CANCELED":
        case "REJECTED":
          color = "error";
          break;
        default:
          color = "primary";
          break;
      }

      return color;
    }
    ,
    fetchApi () {
      return new Promise((resolve) => {
        const action = getFilePerEndpoint(
          this.getEndpointLabel,
          this.$props.getEntityAction.filename,
        );
        let params = {
          first: 30,
          skip: this.$data.pagination.pageStart,
          page: this.$data.pagination.page,
        };
        if (this.$props.getEntityAction.params) {
          params = { ...params, ...this.$props.getEntityAction.params };
        }
        action[this.$props.getEntityAction.actionName](
          params,
          this.$apollo,
        ).then((result) => {
          let items = [];
          if (result["hydra:member"]) {
            items = result["hydra:member"];
            this.$data.totalItems = result["hydra:totalItems"];
          } else {
            this.$data.totalItems = result.length;
            items = result;
          }
          this.$data.items = items.map((item) => {
            if (this.$props.keyObject.length > 0) {
              if (this.$props.keyObjectToDelete.length > 0) {
                item = {
                  [this.$props.keyObjectToDelete]: item.id,
                  ...item[this.$props.keyObject],
                };
              } else {
                item = {
                  ...item[this.$props.keyObject],
                };
              }
            }
            if (item.startDate && item.endDate) {
              item = {
                ...item,
                startDate: formatDate(item.startDate),
                endDate: formatDate(item.endDate),
              };
            }
            return {
              ...item,
              createdAt: formatDate(item.createdAt),
              updatedAt: formatDate(item.updatedAt),
            };
          });
          resolve();
        });
      });
    }
    ,
    editItem (item) {
      this.$router.push({
        name: this.$props.pathToEdit.name,
        params: { id: item.id },
      });
    },
    showItem (item) {
      console.log(item)
      this.$router.push({
        name: this.$props.pathToShow.name,
        params: { id: item.id },
      });
    },
    deleteItem (item) {
      this.$data.itemToDelete = this.$props.keyObjectToDelete.length > 0 ? item[this.$props.keyObjectToDelete] : item.id;
      this.$data.dialogDelete = true;
    }
    ,
    closeDelete () {
      this.$data.dialogDelete = false;
    }
    ,
    deleteConfirm () {
      const action = getFilePerEndpoint(
        this.getEndpointLabel,
        this.$props.deleteEntityAction.filename,
      );
      action[this.$props.deleteEntityAction.actionName](
        this.$data.itemToDelete,
        this.$apollo,
      )
        .then(() => {
          this.addFlashMessage({
            type: "success",
            message: "Succès lors de la suppression",
          });
          this.closeDelete();
          this.initialize();
        })
        .catch((err) => console.error(err));
    },
    nextPage () {
      this.$data.pagination.page = this.$data.pagination.page + 1;
      this.$data.pagination.pageStart = this.$data.pagination.pageStart + 30;
      this.initialize();
    }
    ,
    previousPage () {
      if (this.$data.pagination.page > 1) {
        this.$data.pagination.page = this.$data.pagination.page - 1;
        this.$data.pagination.pageStart = this.$data.pagination.pageStart - 30;
        this.initialize();
      }
    }
    ,
  }
  ,
}
;
</script>

<style scoped>
.toolbar__content {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
}

.toolbar__content .search {
  margin-right: 10px;
}

.custom-footer {
  border-top: thin solid rgba(0, 0, 0, 0.12);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.75rem;
  padding: 20px 8px;
}

.custom-pagination {
  margin: 0 32px 0 24px;
  display: block;
  text-align: center;
}

.custom-icons-before {
  margin-right: 20px;
}
</style>
