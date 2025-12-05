import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipe-profile',
  templateUrl: './pipe-profile.component.html',
  styleUrl: './pipe-profile.component.scss',
})
export class PipeProfileComponent implements OnInit {
  searchTerm: string = '';
  activePipeList: string = 'Help Desk';

  profiles: any = [];

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
  handleNewClient(newClient: any) {
    //this.clients.push(newClient);
  }

  changePipeList(pipe: string) {
    this.activePipeList = pipe;
  }

  ngOnInit() {}
}
