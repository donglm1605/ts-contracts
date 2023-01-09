import {
  NearBindgen,
  near,
  call,
  view,
  initialize,
  LookupMap,
  UnorderedMap,
} from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";
import { NearPromise } from "near-sdk-js";
import { Option } from "./utils";

class Token {
  token_id: number;
  owner_id: AccountId;
  name: string;
  description: string;
  media_uri: string;
  level: number;
  constructor(
    token_id: number,
    owner_id: AccountId,
    name: string,
    description: string,
    media_uri: string,
    level: number
  ) {
    (this.token_id = token_id),
      (this.owner_id = owner_id),
      (this.name = name),
      (this.description = description),
      (this.media_uri = media_uri),
      (this.level = level);
  }
}

@NearBindgen({})
class Contract {
  owner_id: AccountId;
  token_id: number;
  owner_by_id: LookupMap<string>;
  token_by_id: LookupMap<string>;
  constructor() {
    this.token_id = 0;
    this.owner_id = "";
    this.owner_by_id = new LookupMap("o");
    this.token_by_id = new LookupMap("t");
  }

  @initialize({})
  init({ owner_id, prefix }: { owner_id: AccountId; prefix: string }) {
    this.token_id = 0;
    this.owner_id = owner_id;
    this.owner_by_id = new LookupMap(prefix);
    this.token_by_id = new LookupMap("t");
  }

  @call({}) // token_id = 0
  mint_nft({ token_owner_id, name, description, media_uri, level }) {
    this.owner_by_id.set(this.token_id.toString(), token_owner_id); //{tokenId = 0, 'lamchidong.testnet'}

    let token = new Token(
      this.token_id,
      token_owner_id,
      name,
      description,
      media_uri,
      level
    );

    this.token_id++;

    return token;
  }

  @view({})
  get_token_by_id({ token_id }: { token_id: number }) {
    let token = this.token_by_id.get(token_id.toString());

    if (token === null) {
      return null;
    }

    return token;
  }

  @view({})
  get_supply_tokens() {
    return this.token_id;
  }

  @view({})
  get_all_tokens({ start, max }: { start?: number; max?: number }) {
    var all_tokens = [];

    for (var i = 0; i < this.token_id; i++) {
      all_tokens.push(this.token_by_id.get(i.toString()));
    }

    return all_tokens;
  }

  
  @call({})
  nft_approve({
    token_id,
    owner_id,
    msg,
  }: {
    token_id: number;
    owner_id: AccountId;
    msg: string|null;
  }): Option<NearPromise>;

  nft_revoke({
    token_id,
    account_id,
  }: {
    token_id: number;
    account_id: AccountId;
  });

  nft_revoke_all({ token_id }: { token_id: number });

  nft_is_approved({
    token_id,
    approved_account_id,
    approval_id,
  }: {
    token_id: number;
    approved_account_id: AccountId;
    approval_id: bigint;
  }): boolean;
}