#!/bin/sh
# 항상 저장소 루트에서 실행
mkdir -p output
# 레포 루트 전체를 output으로 복사
cp -R ./* ./output/
echo "./output 폴더 생성 완료"
