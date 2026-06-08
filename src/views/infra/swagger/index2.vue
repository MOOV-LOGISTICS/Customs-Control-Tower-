<!-- <template>

  <div class="app-container">
        <el-card>

<div style="margin-left: 15px;">
        <el-row style="margin-top: 10px;">
          <el-col :span="6">
            <div class="title" style=" line-height: 35px;height: 35px;">Api Portal Doc</div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row style="padding-right: 200px; ">

          <el-col :span="4"
            style=" margin-right: 20px;margin-bottom: 20px; padding: 0px;">
            <el-card style=" min-width: 220px;" @click.native="handleLink(item)">
              <el-button style="background-color: white;border-color: white;width: 100%; height: 60px; " type="primary"
                size="mini" class="bun"><i style="font-size: 35px;color: #004F7C;" class="el-icon-download"></i><span
                  style=" font-size: 25px;color: #004F7C;padding: 0px;">Api_portal.docx</span>
              </el-button>
            </el-card>

          </el-col>

        </el-row>
                <el-divider></el-divider>
                <el-row>
                  <el-col :span="8">
                    <div class="title" style="line-height: 35px;height: 35px;">Api Portal</div>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                        <el-row>

                          <el-tabs v-model="activeName">
                            <el-tab-pane label="Shipment API" name="tab1">
                              <div id="swagger-ui-shipment"></div>
                            </el-tab-pane>
              

                          </el-tabs>
                        </el-row>

</div>

        </el-card>

</div>
</template>

<script>
  import SwaggerUIBundle from '@/components/swagger-ui-dist/swagger-ui-bundle'// svg component

  import SwaggerUIStandalonePreset from "@/components/swagger-ui-dist/swagger-ui-standalone-preset";
  import "@/components/swagger-ui-dist/swagger-ui.css";

  import { getBaseHeader } from "@/utils/request";


  export default {
       data() {
            return {
              activeName: 'tab1'
            };
          },
    mounted() {
            {
        const ui = SwaggerUIBundle({
        //  url: process.env.VUE_APP_BASE_API + "/v3/api-docs/shipment",

          url: process.env.VUE_APP_BASE_API + "/v3/api-docs/shipment?token="+getBaseHeader()['Authorization']+'&tenantId='+getBaseHeader()['tenant-id'],
          dom_id: "#swagger-ui-shipment",
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout",
        });
      }

// {
//         const ui = SwaggerUIBundle({
//           url: process.env.VUE_APP_BASE_API + "/v3/api-docs/shipment_vgm",
//           dom_id: "#swagger-ui-vgm",
//           presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
//           layout: "StandaloneLayout",
//         });
// }

// {
//           const ui = SwaggerUIBundle({
//           url: process.env.VUE_APP_BASE_API + "/v3/api-docs/all",
//           dom_id: "#swagger-ui-all",
//           presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
//           layout: "StandaloneLayout",
//         });
// }




    },

    methods: {
    handleLink(fileUrl) {
          window.open("https://ct.smartmoovhub.com/admin-api/infra/file/5/get/5554339d68df468396ceaf370525ca89.docx");
        },
    }

  };
</script>

<style scoped>
</style> -->
