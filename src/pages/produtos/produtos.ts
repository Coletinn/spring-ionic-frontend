import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';


@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

    ionViewDidLoad() {
      this.loadData();
    }

    loadData() {
      let categoria_id = this.navParams.get('categoria_id');
      let loader = this.presentLoading();
      this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => {
        this.items = this.items.concat(response['content']);
        loader.dismiss();
        console.log(this.page);
        console.log(this.items);
      },
      error => {
        loader.dismiss();
      });
    }

    loadImageUrls() {
      for (var i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {item.imageUrl = 
          `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
        error => {})
      }
    }

    showDetail(produto_id : string) {
      this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
    }

    presentLoading() {
      let loader = this.loadingCtrl.create({
        content: "Aguarde",
        duration: 3000
      });
      loader.present();
      return loader;
    }

    doRefresh(event) {
      this.page = 0;
      this.items = [];
      this.loadData();
      setTimeout(() => {

        event.complete();
      }, 1000);
    }

    doInfinite(infiniteScroll) {
      this.page++;
      this.loadData();
      setTimeout(() => {
        infiniteScroll.complete();
      }, 1000);
    }
}
