# デプロイメントガイド

## 概要

このガイドでは、コンテナ化モジュラーモノリスフレームワークで構築されたアプリケーションのデプロイメントプロセスについて説明します。このフレームワークは複数のデプロイメント戦略とクラウドプロバイダーをサポートしています。

## デプロイメント戦略

### 単一コンテナデプロイメント

最もシンプルなデプロイメント戦略は、アプリケーション全体を単一のコンテナにパッケージ化することです：

1. **アプリケーションのビルド**：
   ```bash
   npm run build
   ```

2. **Dockerイメージのビルド**：
   ```bash
   docker build -t my-app:latest .
   ```

3. **コンテナの実行**：
   ```bash
   docker run -p 8080:8080 my-app:latest
   ```

### マルチコンテナデプロイメント

より複雑なアプリケーションの場合、各モジュールを独自のコンテナにデプロイできます：

1. **すべてのモジュールのビルド**：
   ```bash
   npm run build:all
   ```

2. **各モジュールのDockerイメージのビルド**：
   ```bash
   docker-compose build
   ```

3. **コンテナのデプロイ**：
   ```bash
   docker-compose up -d
   ```

## クラウドプロバイダーへのデプロイメント

### AWSへのデプロイメント

#### 前提条件
- AWS CLIがインストールおよび設定済み
- ECRリポジトリが作成済み
- ECSクラスターが設定済み

#### デプロイメント手順

1. **Dockerイメージのビルドとタグ付け**：
   ```bash
   docker build -t my-app:latest .
   ```

2. **ECRへのログイン**：
   ```bash
   aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com
   ```

3. **ECR用のイメージタグ付け**：
   ```bash
   docker tag my-app:latest 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
   ```

4. **イメージをECRにプッシュ**：
   ```bash
   docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
   ```

5. **ECSサービスの更新**：
   ```bash
   aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment
   ```

### GCPへのデプロイメント

#### 前提条件
- Google Cloud SDKがインストールおよび設定済み
- GCRリポジトリへのアクセス権
- GKEクラスターが設定済み

#### デプロイメント手順

1. **Dockerイメージのビルドとタグ付け**：
   ```bash
   docker build -t my-app:latest .
   ```

2. **GCR用のイメージタグ付け**：
   ```bash
   docker tag my-app:latest gcr.io/my-project/my-app:latest
   ```

3. **イメージをGCRにプッシュ**：
   ```bash
   docker push gcr.io/my-project/my-app:latest
   ```

4. **GKEへのデプロイ**：
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   ```

### Azureへのデプロイメント

#### 前提条件
- Azure CLIがインストールおよび設定済み
- Azure Container Registryへのアクセス権
- AKSクラスターが設定済み

#### デプロイメント手順

1. **Dockerイメージのビルドとタグ付け**：
   ```bash
   docker build -t my-app:latest .
   ```

2. **ACRへのログイン**：
   ```bash
   az acr login --name myregistry
   ```

3. **ACR用のイメージタグ付け**：
   ```bash
   docker tag my-app:latest myregistry.azurecr.io/my-app:latest
   ```

4. **イメージをACRにプッシュ**：
   ```bash
   docker push myregistry.azurecr.io/my-app:latest
   ```

5. **AKSへのデプロイ**：
   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   ```

## 環境設定

### 環境変数

異なるデプロイメント環境の環境変数を設定します：

1. **開発環境**：
   - `.env.development`ファイルを作成
   - 開発環境固有の変数を設定

2. **本番環境**：
   - `.env.production`ファイルを作成
   - 本番環境固有の変数を設定

3. **環境変数の読み込み**：
   ```javascript
   // アプリケーション内で
   require('dotenv').config({
     path: `.env.${process.env.NODE_ENV}`
   });
   ```

### シークレット管理

機密情報については、クラウドプロバイダーのシークレット管理を使用します：

- **AWS**: AWS Secrets Manager
- **GCP**: Google Secret Manager
- **Azure**: Azure Key Vault

## 継続的デプロイメント

### GitHub Actions

継続的デプロイメントのためのGitHub Actionsワークフロー例：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: myregistry.azurecr.io/my-app:latest
          
      - name: Deploy to AKS
        uses: azure/k8s-deploy@v1
        with:
          manifests: kubernetes/deployment.yaml
```

## モニタリングとロギング

### モニタリング

デプロイされたアプリケーションのモニタリングを設定します：

- **AWS**: CloudWatch
- **GCP**: Cloud Monitoring
- **Azure**: Azure Monitor

### ロギング

集中ロギングを設定します：

- **AWS**: CloudWatch Logs
- **GCP**: Cloud Logging
- **Azure**: Azure Log Analytics

## スケーリング

### 水平スケーリング

アプリケーションの自動スケーリングを設定します：

- **Kubernetes**: Horizontal Pod Autoscaler
- **AWS**: ECS Service Auto Scaling
- **GCP**: GKE Cluster Autoscaler
- **Azure**: AKS Cluster Autoscaler

### 垂直スケーリング

必要に応じてリソース割り当てを調整します：

- CPUとメモリの割り当てを増やす
- インスタンスタイプをアップグレードする

## トラブルシューティング

### 一般的なデプロイメントの問題

#### コンテナ起動の失敗

コンテナが起動に失敗する場合：
1. コンテナログを確認する
2. 環境変数を確認する
3. ポートが正しくマッピングされていることを確認する

#### ネットワークの問題

サービスが通信できない場合：
1. ネットワークポリシーを確認する
2. サービスディスカバリの設定を確認する
3. サービス間の接続をテストする

#### リソース制約

アプリケーションが遅いまたはクラッシュする場合：
1. リソース使用率を確認する
2. リソース制限を増やす
3. 水平スケーリングを検討する
